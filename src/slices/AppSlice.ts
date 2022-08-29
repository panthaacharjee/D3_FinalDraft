import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStakingv2ABI } from "../abi/OlympusStakingv2.json";
import { abi as BusdABI } from "../abi/Busd.json"
import { abi as DaiBondContract } from "../abi/bonds/DaiContract.json";

import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as D3Token } from "../abi/D3Token.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "../helpers/NodeHelper";
import apollo from "../lib/apolloClient";
import {  handleContractError } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2, SOhmv2 } from "../typechain";
import allBonds from "../helpers/AllBonds";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly d3CirculatingSupply: string;
  readonly sD3CirculatingSupply: string;
  readonly totalSupply: string;
  readonly d3Price: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedD3: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
   
  
    let  stakingTVL: Number = 0;
    let  marketPrice: Number = 1.0;
    let  marketCap: Number = 0;
    let  circSupply: Number = 0;
    let  totalSupply: Number = 0;
    let  treasuryMarketValue: Number = 0;
    let burn: Number = 0;
    let emission: Number = 0;
    let nextBlock: Number = 0;
    const ohmAmount = 1512.12854088 * Number(marketPrice);
    const currentBlock = await provider.getBlockNumber();
    try {
      const d3Contract = new ethers.Contract(
        addresses[networkID].D3_ADDRESS as string,
        D3Token,
        provider,
      ) ;
      totalSupply = (await d3Contract.totalSupply()) / Math.pow(10, 9);
      burn = (await d3Contract.burnTracker()) / Math.pow(10,9);

      console.log("totalSupply-->>",totalSupply, "-->burn-->>", burn)
    } catch (e) {
      handleContractError(e);
    }

    try {
      const bondContract = new ethers.Contract(
        addresses[networkID].DIABOND_ADDRESS as string,
        DaiBondContract,
        provider,
      ) ;
     let epoch = (await bondContract.epoch());
      let em = epoch.dailyEmission;
      emission = (em / Math.pow(10,9));

      console.log("-->emission-->>", emission)
    } catch (e) {
      handleContractError(e);
    }

    
    const busdContract = new ethers.Contract(
      addresses[networkID].BUSD_ADDRESS as string,
      BusdABI,
      provider,
    ) ;
    // console.log("------------>>",await busdContract.totalSupply())
  
    marketPrice =  await getMarketPrice({networkID,provider});
    marketPrice = Number(marketPrice) ;
    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2ABI,
      provider,
    ) as OlympusStakingv2;

    const sohmMainContract = new ethers.Contract(
      addresses[networkID].sD3_ADDRESS as string,
      sOHMv2,
      provider,
    ) as SOhmv2;
    
   
    
    circSupply = Number(await sohmMainContract.circulatingSupply()) / Math.pow(10, 9);

    marketCap = Number(totalSupply) * Number(marketPrice);
    stakingTVL = Number(circSupply) * Number(marketPrice);
   

    const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
    const tokenBalances = await Promise.all(tokenBalPromises);
    const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, 0);
    // alert(treasuryBalance)
    const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
    const tokenAmounts = await Promise.all(tokenAmountsPromises);
    const rfvTreasury = tokenAmounts.reduce((tokenAmount0, tokenAmount1) => tokenAmount0 + tokenAmount1, 0);

    const timeBondsAmountsPromises = allBonds.map(bond => bond.getTimeAmount(networkID, provider));
    const timeBondsAmounts = await Promise.all(timeBondsAmountsPromises);
    const timeAmount = timeBondsAmounts.reduce((timeAmount0, timeAmount1) => timeAmount0 + timeAmount1, 0);
    const timeSupply = Number(totalSupply) - timeAmount;

    const rfv = rfvTreasury / timeSupply;
    const treasuryRunway = rfvTreasury /Number(circSupply) ;
   
    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    nextBlock = Number(epoch.endBlock);
    const circ = await sohmMainContract.circulatingSupply();
    const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 2) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 2) - 1;

    // Current index
    const currentIndex = await stakingContract.index();
    const runway = Math.log(treasuryRunway) / Math.log(1 +  stakingRebase) / 2;
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL,
        marketPrice,
        marketCap,
        circSupply,
        totalSupply,
        burn,
        emission,
        treasuryMarketValue,
      } as IAppData;
    }
   
    return {
      currentIndex: currentIndex.toString(),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      burn,
      emission,
      nextBlock,
      treasuryMarketValue,
      runway,
      rfv
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
        const d3Contract = new ethers.Contract(
          addresses[networkID].D3_ADDRESS as string,
          ierc20Abi,
          provider
        )
        // const reserveContract = bond.getContractForReserve(networkID, provider);
        
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice from eth mainnet
    marketPrice = await getMarketPrice({ networkID, provider });
    // let mainnetProvider = (marketPrice = await getMarketPrice({ 1: NetworkID, provider }));
    marketPrice = marketPrice ;
    // alert(marketPrice)
  } catch (e) {
    
    marketPrice = await getTokenPrice("defi") || 1.034;
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly burn?: number;
  readonly emission?: number;
  readonly nextBlock?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly runway?: number;
  readonly rfv?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
