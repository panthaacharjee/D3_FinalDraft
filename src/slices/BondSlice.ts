import { ethers, BigNumber, BigNumberish } from "ethers";
import { contractForRedeemHelper ,contractForDividEnd} from "../helpers";
import { calculateUserBondDetails, getBalances } from "./AccountSlice";
import { findOrLoadMarketPrice } from "./AppSlice";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getBondCalculator } from "../helpers/BondCalculator";
import { RootState } from "../store";
import { abi as CCFBONDContract }  from "../abi/CcfReserveContract.json";
import { addresses } from "../constants";
import {
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk,
  ICalcBondDetailsAsyncThunk,
  IJsonRPCError,
  IRedeemAllBondsAsyncThunk,
  IRedeemBondAsyncThunk,
  IDividEndsAsyncThunk
} from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import ReactGA from "react-ga";
import { collectFields } from "graphql/execution/execute";

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ address, bond, provider, networkID }: IApproveBondAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserve(networkID, signer);
    const bondAddr = bond.getAddressForBond(networkID);
    console.log("bondAddress-->>",bondAddr)
    let approveTx;
    let bondAllowance = await reserveContract.allowance(address, bondAddr || "");
   
    // return early if approval already exists
    if (bondAllowance.gt(BigNumber.from("0"))) {
      dispatch(info("Approval completed."));
      dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      return;
    }

    try {
      approveTx = await reserveContract.approve(
        bondAddr || "",
        ethers.utils.parseUnits("1000000000", "ether").toString(),
      );
      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          text: "Approving " + bond.displayName,
          type: "approve_" + bond.name,
        }),
      );
      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
        dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      }
    }
  },
);

export interface IBondDetails {
  bond: string;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  maxBondPrice: number;
  bondPrice: number;
  marketPrice: number;
  dailyEmission: number;
  assetAmount: number;
  assetPrice: number;
}
export const calcBondDetails = createAsyncThunk(
  "bonding/calcBondDetails",
  async ({ bond, value, provider, networkID }: ICalcBondDetailsAsyncThunk, { dispatch }): Promise<IBondDetails> => {
    if (!value || value === "") {
      value = "0";
    }
    const amountInWei = ethers.utils.parseEther(value);

    let bondPrice = BigNumber.from(0),
      bondDiscount = 0,
      valuation = 0,
      bondQuote: BigNumberish = BigNumber.from(0),
      dailyEmission: BigNumberish = BigNumber.from(0),
      assetPrice = 0;
      const CCFContract = new ethers.Contract(
        addresses[networkID].CCF_ADDRESS as string,
       CCFBONDContract,
        provider,
      ) ;
    const bondContract = bond.getContractForBond(networkID, provider);
    const bondCalcContract = getBondCalculator(networkID, provider);
    const terms = await bondContract.terms();
    const maxBondPrice = await bondContract.maxPayout();
    let debtRatio: BigNumberish;
    // TODO (appleseed): improve this logic
    if (bond.name === "CCF") {
      debtRatio = await bondContract.debtRatio();
    } else {
      debtRatio = await bondContract.standardizedDebtRatio();
    }
    debtRatio = Number(debtRatio.toString()) / Math.pow(10, 9);

    let marketPrice: number = 0;
    try {
      const originalPromiseResult = await dispatch(
        findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
      console.log("marketPrice-->>",marketPrice)
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
    }

    try {
      // TODO (appleseed): improve this logic
      if (bond.name === "CC") {
        let bondPriceRaw = await bondContract.bondPrice();
        let assetPriceUSD = await bond.getBondReservePrice(networkID, provider);
        let assetPriceBN = ethers.utils.parseUnits(assetPriceUSD.toString(), 14);
        // bondPriceRaw has 4 extra decimals, so add 14 to assetPrice, for 18 total
        bondPrice = bondPriceRaw.mul(assetPriceBN);
      } else {
        bondPrice = await bondContract.bondPriceInUSD();
        console.log("bondPrice-->>>",bondPrice, Number(bondPrice.toString()),marketPrice)
      }
     

      bondDiscount = (marketPrice * Math.pow(10, 18) - Number(bondPrice.toString())) / Number(bondPrice.toString()); // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
      console.log("bondDiscound--..>>",bondDiscount)  

    } catch (e) {
      console.log("error getting bondPriceInUSD", bond.name, e);
    }

    try{
     
      if (bond.name === "CCF") {
        const epoch = await CCFContract.epoch();
        dailyEmission = epoch.inStock;
      } else {
        const epoch = await bondContract.epoch();
      dailyEmission = epoch.inStock;
      }

    } catch(e){
      console.log("error getting Daily Emission!")
    }

    if (Number(value) === 0) {
      // if inputValue is 0 avoid the bondQuote calls
      bondQuote = BigNumber.from(0);
    } else if (bond.isLP) {
      valuation = Number(
        (await bondCalcContract.valuation(bond.getAddressForReserve(networkID) || "", amountInWei)).toString(),
      );
      bondQuote = await bondContract.payoutFor(valuation);

      if (!amountInWei.isZero() && Number(bondQuote.toString()) < 100000) {
        bondQuote = BigNumber.from(0);
        const errorString = "Amount is too small!";
        dispatch(error(errorString));
      } else {
        bondQuote = Number(bondQuote.toString()) / Math.pow(10, 9);
      }
    } else {
      // RFV = DAI
      bondQuote = await bondContract.payoutFor(amountInWei);
      console.log("bondQuote--->>",Number(bondQuote.toString()),amountInWei)
      if (!amountInWei.isZero() && Number(bondQuote.toString()) < 100000000000000) {
        bondQuote = BigNumber.from(0);
        const errorString = "Amount is too small!";
        dispatch(error(errorString));
      } else {
        if(bond.name==="CCF"){
          bondQuote = Number(bondQuote.toString()) / Math.pow(10, 18);
        }else{
          bondQuote = Number(bondQuote.toString()) / Math.pow(10, 18);
        }
      }
    }

    // Display error if user tries to exceed maximum.
    if (!!value && parseFloat(bondQuote.toString()) > Number(maxBondPrice.toString()) / Math.pow(10, 9)) {
      const errorString =
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
        (Number(maxBondPrice.toString()) / Math.pow(10, 9)).toFixed(2).toString() +
        " DEFI.";
      dispatch(error(errorString));
    }

    // Calculate bonds purchased
    let purchased = await bond.getTreasuryBalance(networkID, provider);
    if(purchased == NaN){
      purchased = 0;
    }
    let assetAmount = await bond.getAssetAmount(networkID, provider);
    console.log("assetAmount-->>", assetAmount);
    if(assetAmount == NaN){
      assetAmount = 0;
    }

    return {
      bond: bond.name,
      bondDiscount,
      debtRatio: Number(debtRatio.toString()),
      bondQuote: Number(bondQuote.toString()),
      purchased,
      vestingTerm: Number(terms.vestingTerm.toString()),
      maxBondPrice: Number(maxBondPrice.toString()) / Math.pow(10, 9),
      bondPrice: Number(bondPrice.toString()) / Math.pow(10, 18),
      marketPrice: marketPrice,
      dailyEmission: Number(dailyEmission)/Math.pow(10,9),
      assetAmount: assetAmount,
      assetPrice: Number(assetPrice)

    };
  },
);

export const bondAsset = createAsyncThunk(
  "bonding/bondAsset",
  async ({ value, address, bond, networkID, provider, slippage }: IBondAssetAsyncThunk, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default
    // parseUnits takes String => BigNumber
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");
    let balance;
    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);
    console.log("bond-->>>",bond,bondContract)
    const calculatePremium = await bondContract.bondPrice();
    console.log("calculatePremium-->>>",calculatePremium)
    const maxPremium = Math.round(Number(calculatePremium.toString()) * (1 + acceptedSlippage));

    // Deposit the bond
    let bondTx;
    let uaData = {
      address: address,
      value: value,
      type: "Bond",
      bondName: bond.displayName,
      approved: true,
      txHash: "",
    };
    try {
     
      console.log("deposit-->>", valueInWei, maxPremium, depositorAddress)
      let ddd= await bondContract.bondPriceInUSD();

      console.log("ddddddddddd===>>",ddd.toString())

      if(bond.name=="CCF"){
        bondTx = await bondContract.deposit(ethers.utils.parseUnits((Number(value)).toString(), "gwei"), ethers.utils.parseUnits(maxPremium.toString(), "ether"), depositorAddress);
      } else {
        bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      }

      console.log("bontTX-->>",bondTx)
      dispatch(
        fetchPendingTxns({ txnHash: bondTx.hash, text: "Bonding " + bond.displayName, type: "bond_" + bond.name }),
      );
      uaData.txHash = bondTx.hash;
      await bondTx.wait();
      // TODO: it may make more sense to only have it in the finally.
      // UX preference (show pending after txn complete or after balance updated)

      dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
    } catch (e: unknown) {
      console.log("deposit Error-->>",e)
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else dispatch(error(rpcError.message));
    } finally {
      if (bondTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Bonds",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.bondName,
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(bondTx.hash));
      }
    }
  },
);

export const redeemBond = createAsyncThunk(
  "bonding/redeemBond",
  async ({ address, bond, networkID, provider, autostake }: IRedeemBondAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    let redeemTx;
    let uaData = {
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      autoStake: autostake,
      approved: true,
      txHash: "",
    };
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = "redeem_bond_" + bond + (autostake === true ? "_autostake" : "");
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({ txnHash: redeemTx.hash, text: "Redeeming " + bond.displayName, type: pendingTxnType }),
      );

      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));

      dispatch(getBalances({ address, networkID, provider }));
    } catch (e: unknown) {
      uaData.approved = false;
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Bonds",
          action: uaData.type ?? "unknown",
          label: uaData.bondName,
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
          dimension3: uaData.autoStake.toString(),
        });
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
  },
);

export const redeemAllBonds = createAsyncThunk(
  "bonding/redeemAllBonds",
  async ({ bonds, address, networkID, provider, autostake }: IRedeemAllBondsAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const redeemHelperContract = contractForRedeemHelper({ networkID, provider: signer });

    let redeemAllTx;

    try {
      redeemAllTx = await redeemHelperContract.redeemAll(address, autostake);
      const pendingTxnType = "redeem_all_bonds" + (autostake === true ? "_autostake" : "");

      await dispatch(
        fetchPendingTxns({ txnHash: redeemAllTx.hash, text: "Redeeming All Bonds", type: pendingTxnType }),
      );

      await redeemAllTx.wait();

      bonds &&
        bonds.forEach(async bond => {
          dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
        });

      dispatch(getBalances({ address, networkID, provider }));
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (redeemAllTx) {
        dispatch(clearPendingTxn(redeemAllTx.hash));
      }
    }
  },
);

export const onDividEnd =   async ({address, networkID, provider, dispatch}: IDividEndsAsyncThunk) => {
    if (!provider) {
      alert("Please connect your wallet!")
      return;
    }

    const signer = provider.getSigner();

    const dividEndContract = contractForDividEnd({ networkID, provider: signer });
    //  alert("onDividEnd000000000000000000000000000000000000")

    try {
     
      const canClaim = await dividEndContract.canClaimDividends(address);
      if(canClaim){
        await dividEndContract._ClaimDividend(address);
        dispatch(getBalances({address, networkID, provider}))
      } else{
        dispatch(error("You can't claim now! please wait.."));
      }

      

      // dispatch(getBalances({ address, networkID, provider }));
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      console.log(e)
    } 
  };


// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  status: string;
  [key: string]: any;
}

const setBondState = (state: IBondSlice, payload: any) => {
  const bond = payload.bond;
  const newState = { ...state[bond], ...payload };
  state[bond] = newState;
  state.loading = false;
};

const initialState: IBondSlice = {
  status: "idle",
};

const bondingSlice = createSlice({
  name: "bonding",
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(calcBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: RootState) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);