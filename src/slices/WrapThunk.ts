import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20 } from "../typechain";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const sohmContract = new ethers.Contract(addresses[networkID].sD3_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const wsohmContract = new ethers.Contract(
      addresses[networkID].WSOHM_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    let approveTx;
    let wrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    let unwrapAllowance = await wsohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);

    try {
      if (token === "sohm") {
        // won't run if wrapAllowance > 0
        approveTx = await sohmContract.approve(
          addresses[networkID].WSOHM_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei"),
        );
      } else if (token === "wsohm") {
        approveTx = await wsohmContract.approve(
          addresses[networkID].WSOHM_ADDRESS,
          ethers.utils.parseUnits("1000000000", "ether"),
        );
      }

      const text = "Approve " + (token === "sohm" ? "Wrapping" : "Unwrapping");
      const pendingTxnType = token === "sohm" ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(info("Successfully Approved!"));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    wrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    unwrapAllowance = await wsohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          ohmWrap: +wrapAllowance,
          ohmUnwrap: +unwrapAllowance,
        },
      }),
    );
  },
);

export const changeWrap = createAsyncThunk(
  "wrap/changeWrap",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    dispatch(getBalances({ address, networkID, provider }));
  },
);
