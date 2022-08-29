import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "../lib/Bond";
import { abi as BondCalcContractABI } from "../abi/BondCalcContract.json";
import { ethers } from "ethers";
import { addresses } from "../constants";
import { BondCalcContract } from "../typechain";

export const getBondCalculator = (networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  return new ethers.Contract(
    addresses[networkID].BONDINGCALC_ADDRESS as string,
    BondCalcContractABI,
    provider,
  ) as BondCalcContract;
};
