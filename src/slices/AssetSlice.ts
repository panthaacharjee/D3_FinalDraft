import { ethers, BigNumber, BigNumberish } from "ethers";
import { contractForRedeemHelper ,contractForDividEnd} from "../helpers";
import { calculateUserBondDetails, getBalances } from "./AccountSlice";
import { findOrLoadMarketPrice } from "./AppSlice";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getBondCalculator } from "../helpers/BondCalculator";
import { getTokenPrice, getAssetAmount } from "../helpers";
import { RootState } from "../store";
import {
  IAssetAsyncThunk,
  IJsonRPCError,
} from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import ReactGA from "react-ga";
import { collectFields } from "graphql/execution/execute";

export interface IAssetDetails {
  name1: string;
  assetAmount: number;
  assetPrice: number;
}
export const getAssetDetails = createAsyncThunk(
  "assets/getAssetDetails",
  async ({ asset }: IAssetAsyncThunk, { dispatch }): Promise<IAssetDetails> => {
    console.log("assets-->>", asset);
    let reserveContractAddress = asset.reserveContractAddress;
    let network=asset.network;
    let decimal = asset.decimal;
    let assetAmount = await getAssetAmount({reserveContractAddress, network, decimal});
    let assetPrice = await getTokenPrice(asset.nameForPrice);
    console.log("assetPrice-->>", typeof(assetPrice))
    return {
      name1: asset.name,
      assetAmount: assetAmount,
      assetPrice: assetPrice,
    };
  },
);
interface IAssetSlice {
  [key: string]: any;
}

const setAssetState = (state: IAssetSlice, payload: any) => {
    state[payload.name1] = payload;
};

const initialState: IAssetSlice = {
};

const AssetSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    fetchAssetSuccess(state, action) {
      state[action.payload.name] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAssetDetails.pending, state => {
      })
      .addCase(getAssetDetails.fulfilled, (state, action) => {
        setAssetState(state, action.payload);
      })
      .addCase(getAssetDetails.rejected, (state, { error }) => {
        console.error(error.message);
      });
  },
});

export default AssetSlice.reducer;

export const { fetchAssetSuccess } = AssetSlice.actions;

const baseInfo = (state: RootState) => state.assets;

export const getAssetState = createSelector(baseInfo, assets => assets);