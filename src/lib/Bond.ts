import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

import { abi as ierc20Abi } from "../abi/IERC20.json";
import { getTokenPrice } from "../helpers";
import { getBondCalculator } from "../helpers/BondCalculator";
import { EthContract, PairContract } from "../typechain";
import { addresses } from "../constants";
import React from "react";

export enum NetworkID {
  Mainnet = 56,
  Testnet = 97,
  // Arbitrum = 42161,
  // ArbitrumTestnet = 421611,
  // AvalancheTestnet = 43113,
  // Avalanche = 43114,
  // bscTestnet = 97,
  // bseNet

}

export enum BondType {
  StableAsset,
  LP,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  [NetworkID.Mainnet]?: BondAddresses;
  [NetworkID.Testnet]?: BondAddresses;
  // [NetworkID.Arbitrum]?: BondAddresses;
  // [NetworkID.ArbitrumTestnet]?: BondAddresses;
  // [NetworkID.Avalanche]?: BondAddresses;
  // [NetworkID.AvalancheTestnet]?: BondAddresses;
}

export interface Available {
  [NetworkID.Mainnet]: boolean;
  [NetworkID.Testnet]: boolean;
  // [NetworkID.Arbitrum]: boolean;
  // [NetworkID.ArbitrumTestnet]: boolean;
  // [NetworkID.Avalanche]: boolean;
  // [NetworkID.AvalancheTestnet]: boolean;
}

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  isBondable: Available; // aka isBondable => set false to hide
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  isLOLable: Available; // aka isBondable => set false to hide
  LOLmessage: string; // aka isBondable => set false to hide
  isClaimable: Available; // set false to hide
  bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
  payoutToken: string; // Token the user will receive - currently OHM on ethereum, wsOHM on arbitrum
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly isBondable: Available;
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  readonly isLOLable: Available;
  readonly LOLmessage: string;
  readonly isClaimable: Available;
  readonly type: BondType;
  readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;
  readonly payoutToken: string;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number>;
  abstract getAssetAmount(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number>;
  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.isBondable = bondOpts.isBondable;
    // NOTE (appleseed): temporary for ONHOLD MIGRATION
    this.isLOLable = bondOpts.isLOLable;
    this.LOLmessage = bondOpts.LOLmessage;
    this.type = type;
    this.isClaimable = bondOpts.isClaimable;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
    this.payoutToken = bondOpts.payoutToken;
  }

  /**
   * makes isBondable accessible within Bonds.ts
   * @param networkID
   * @returns boolean
   */
  getBondability(networkID: NetworkID) {
    return this.isBondable[networkID];
  }
  getClaimability(networkID: NetworkID) {
    return this.isClaimable[networkID];
  }
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  getLOLability(networkID: NetworkID) {
    return this.isLOLable[networkID];
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.bondAddress;
  }

  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkID) || "";
    console.log("bondAddress-->>",this.name, bondAddress)
    console.log("bondContractt--->>>",this.bondContractABI)
    return new ethers.Contract(bondAddress, this.bondContractABI, provider) ;
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.reserveAddress;
  }
  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID) || "";
    console.log("reserveAddress", bondAddress)
    console.log("reserveContract-->>",this.reserveContract)
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PairContract;
  }

  // TODO (appleseed): improve this logic
  async getBondReservePrice(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    let marketPrice: number;
    if (this.isLP) {
      const pairContract = this.getContractForReserve(networkID, provider);
      const reserves = await pairContract.getReserves();
      marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    } else {
      marketPrice = await getTokenPrice("cross-chain-farming");

    }
    return marketPrice;
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }
  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    const token = this.getContractForReserve(networkID, provider);
    const tokenAddress = this.getAddressForReserve(networkID);
    const bondCalculator = getBondCalculator(networkID, provider);
    const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
    const markdown = await bondCalculator.markdown(tokenAddress || "");
    let tokenUSD = (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
    return Number(tokenUSD.toString());
  }
  public getTokenAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    return this.getReserves(networkID, provider, true);
  }

  async getAssetAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    const token = this.getContractForReserve(networkID, provider);
    const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    return Number(tokenAmount.toString());
  }


  public getTimeAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
      return this.getReserves(networkID, provider, false);
  }

  private async getReserves(networkID: NetworkID, provider: StaticJsonRpcProvider, isToken: boolean): Promise<number> {
      // const addresses = addresses(networkID);

      const token = this.getContractForReserve(networkID, provider);

      let [reserve0, reserve1] = await token.getReserves();
      const token1: string = await token.token1();
      const isTime = token1.toLowerCase() === addresses[networkID].D3_ADDRESS.toLowerCase();

      return isToken ? this.toTokenDecimal(false, isTime ? Number(reserve0): Number(reserve1)) : this.toTokenDecimal(true, isTime ? Number(reserve1) : Number(reserve0));
  }

  private toTokenDecimal(isTime: boolean, reserve: number) {
      return isTime ? reserve / Math.pow(10, 9) : reserve / Math.pow(10, 18);
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOpts extends BondOpts {}
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    let token = this.getContractForReserve(networkID, provider);
    let tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    return Number(tokenAmount.toString()) / Math.pow(10, 18);
  }
  async getAssetAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    let token = this.getContractForReserve(networkID, provider);
    let tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    return Number(tokenAmount.toString()) / Math.pow(10, 18);
  }

  public async getTokenAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    return this.getTreasuryBalance(networkID, provider);
  }
  public getTimeAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    return new Promise<number>(reserve => reserve(0));
}
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  bondType: number;
  lpUrl: string;
  customTreasuryBalanceFunc: (
    this: CustomBond,
    networkID: NetworkID,
    provider: StaticJsonRpcProvider,
  ) => Promise<number>;
  customAssetAmountFunc: (
    this: CustomBond,
    networkID: NetworkID,
    provider: StaticJsonRpcProvider,
  ) => Promise<number>;
}
export class CustomBond extends Bond {
  readonly isLP: Boolean;
  getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getAssetAmount(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number> {
    throw new Error("Method not implemented.");
  }
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.bondType, customBondOpts);

    if (customBondOpts.bondType === BondType.LP) {
      this.isLP = true;
    } else {
      this.isLP = false;
    }
    this.lpUrl = customBondOpts.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName;
    this.reserveContract = customBondOpts.reserveContract;
    this.getTreasuryBalance = customBondOpts.customTreasuryBalanceFunc.bind(this);
    this.getAssetAmount = customBondOpts.customAssetAmountFunc.bind(this);
  }
  public async getTokenAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    return this.getTreasuryBalance(networkID, provider);
  }
  public getTimeAmount(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    return new Promise<number>(reserve => reserve(0));
}
  
}
