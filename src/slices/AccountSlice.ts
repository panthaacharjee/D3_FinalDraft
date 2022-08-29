import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as dividendABI } from "../abi/dividend.json"

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { IERC20,  SOhmv2 } from "../typechain";
import { NumericDictionaryIteratee } from "lodash";
interface IUserBalances {
  balances: {
    gohm: string;
    ohm: string;
    sohm: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from("0");
    let sohmBalance = BigNumber.from("0");

    let poolBalance = BigNumber.from("0");
    let totalPayout = BigNumber.from("0");
    let totalBUSDClaimed = BigNumber.from("0");
    let pendingBUSD = BigNumber.from("0");
    let nextPayOut = BigNumber.from("0");
    let rebasePool = BigNumber.from("0");
    try {
      const dividendontract = new ethers.Contract(addresses[networkID].DIVIDEND_ADDRESS as string, dividendABI, provider);
      poolBalance = await dividendontract.getPoolBalance();
      totalPayout = await dividendontract.poolTotalPayouts();
      totalBUSDClaimed = await dividendontract._totalClaimed(address);
      pendingBUSD = await dividendontract._shareHolderBalance(address)
      nextPayOut = await dividendontract._nextClaim(address);

      rebasePool = await dividendontract.rebaseNextEpoch()

      
    } catch (e) {
      console.log("dividend-->>>",e);
    }
    try {
      const ohmContract = new ethers.Contract(
        addresses[networkID].D3_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
      // alert(ohmBalance)
    } catch (e) {
      console.log(e);
    }
    try {
      const sohmContract = new ethers.Contract(
        addresses[networkID].sD3_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      sohmBalance = await sohmContract.balanceOf(address);
    } catch (e) {
      console.log(e);
    }

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        poolBalance : Number(poolBalance.toString())/Math.pow(10,18),
        totalPayout : Number(totalPayout.toString())/Math.pow(10,18),
        totalBUSDClaimed : Number(totalBUSDClaimed.toString())/Math.pow(10,18),
        pendingBUSD : Number(pendingBUSD.toString())/Math.pow(10,18),
        nextPayOut : Number(nextPayOut.toString()) ,
        rebasePool: Number(rebasePool.toString())+3600 
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
}


export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let stakeAllowance = BigNumber.from("0");
    let unstakeAllowance = BigNumber.from("0");

    try {
   
      const ohmContract = new ethers.Contract(
        addresses[networkID].D3_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

      const sohmContract = new ethers.Contract(addresses[networkID].sD3_ADDRESS as string, sOHMv2, provider) as SOhmv2;
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    } catch (e) {
      console.warn("failed contract calls in slice", e);
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
     
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    // if(bond.name=="CCF"){
    //   interestDue = interestDue *1000
    // }
    // bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastTime;
    //  bondMaturationBlock = Number(bondDetails.lastTime)/BLOCK_RATE_SECONDS;
     bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    //  alert("lastTime"+bondDetails.lastBlock)

    //  alert("lblock-->"+ bondMaturationBlock)
    //  alert("vesting-->"+ bondDetails.vesting)
    pendingPayout = await bondContract.pendingPayoutFor(address);
    let allowance,
    balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    let balanceVal = ethers.utils.formatEther(balance);
    if(bond.bondToken == "CCF"){
      balanceVal = (Number(balanceVal) * Math.pow(10,9)).toString()
    }
    // balanceVal should NOT be converted to a number. it loses decimal precision

    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    gohm: string;
    ohm: string;
    sohm: string;
    dai: string;
  };
  loading: boolean;
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    gohm: "",
    ohm: "",
    sohm: "",
    dai: "",
  
  },
  staking: { ohmStake: 0, ohmUnstake: 0 },

};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
