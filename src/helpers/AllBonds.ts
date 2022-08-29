import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "../lib/Bond";
import { addresses } from "../constants";

import { ReactComponent as BusdImg } from "../assets/tokens/BUSD.svg";
import { ReactComponent as CcfImg } from "../assets/tokens/CCF.svg";
import { ReactComponent as RefiImg } from "../assets/tokens/refi.svg";
import { ReactComponent as DefiBusdImg } from "../assets/tokens/DEFI_BUSD.svg";
import { ReactComponent as USDT } from "../assets/tokens/USDT.svg";
import { ReactComponent as WBNBImg } from "../assets/tokens/WBNB.svg";

import { abi as FraxOhmBondContract } from "../abi/bonds/OhmFraxContract.json";

import { abi as DaiBondContract } from "../abi/bonds/DaiContract.json";
import { abi as WBNBBondContract } from "../abi/bonds/WBNBContract.json";
import { abi as USDTBondContract } from "../abi/bonds/USDTContract.json";
import { abi as ReserveOhmFraxContract } from "../abi/reserves/OhmFrax.json";

import { abi as CvxBondContract } from "../abi/bonds/CvxContract.json";
import { abi as RefiBondContract } from "../abi/bonds/RefiContract.json";

import { abi as ierc20Abi } from "../abi/IERC20.json";
import { BigNumberish } from "ethers";
import { getTokenPrice } from "../helpers";




export const defi_busd = new LPBond({
  name: "defi_busd_lp",
  displayName: "DEFI-BUSD LP",
  bondToken: "BUSD",
  payoutToken: "DEFI",
  bondIconSvg: DefiBusdImg,
  bondContractABI: FraxOhmBondContract,
  reserveContract: ReserveOhmFraxContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  isLOLable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  LOLmessage: "Connect",
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x3597e1612a0336825e390f53be7E55FfA247f98e",
      reserveAddress: "0xf9A3b7A967084630c5a3100f88ef981e3BBb1DAa",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
      reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
    },
  },
  lpUrl:"https://pancakeswap.finance/add/0xB4c16Ed711c06b84e4312d5f09bcbD88E4F4d3b6/0xe9e7cea3dedca5984780bafc599bd69add087d56"
});

export const busd = new StableBond({
  name: "busd",
  displayName: "BUSD",
  bondToken: "BUSD",
  payoutToken: "DEFI",
  bondIconSvg: BusdImg,
  bondContractABI: DaiBondContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  isLOLable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  LOLmessage: "Connect",
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x2b70D81b1248BBF56Ce289061D484a240902C19C",
      reserveAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x746145378D551d28f8C7651A13B78C493977831c",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});
export const usdt = new StableBond({
  name: "usdt",
  displayName: "USDT",
  bondToken: "USDT",
  payoutToken: "DEFI",
  bondIconSvg: USDT,
  bondContractABI: USDTBondContract,
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  isLOLable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  LOLmessage: "Connect",
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xec5E8c2c56A7700f5fC137cc700163DBaC9f5105",
      reserveAddress: "0x55d398326f99059ff775485246999027b3197955",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x746145378D551d28f8C7651A13B78C493977831c",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});

export const bnb = new CustomBond({
  name: "BNB",
  displayName: "wBNB",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wBNB",
  payoutToken: "DEFI",
  bondIconSvg: WBNBImg,
  bondContractABI: WBNBBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  isLOLable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,,
  },
  LOLmessage: "connect",
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xE79b0ed2F08Ecfdfae848fd7b2E2D165cb56a289",
      reserveAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x746145378D551d28f8C7651A13B78C493977831c",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const ethBondContract = this.getContractForBond(NetworkId, provider);
    let ethPrice: BigNumberish = await ethBondContract.assetPrice();
    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(NetworkId, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
  customAssetAmountFunc: async function (this: CustomBond, networkID, provider) {
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 9);
    return cvxAmount;
  },
});

export const ccf = new CustomBond({
  name: "CCF",
  displayName: "CCF",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "CCF",
  payoutToken: "DEFI",
  bondIconSvg: CcfImg,
  bondContractABI: CvxBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  isLOLable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  LOLmessage: "connect",
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xdF2BCc1578B2eB8e1382B9938BD7053Aa4eB0FF3",
      reserveAddress: "0x7f9528b913a99989b88104b633d531241591a358",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    let cvxPrice: number = await getTokenPrice("cross-chain-farming");
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 9);
    return cvxAmount * cvxPrice;
  },
  customAssetAmountFunc: async function (this: CustomBond, networkID, provider) {
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 9);
    return cvxAmount;
  },
});



export const refi = new CustomBond({
  name: "REFI",
  displayName: "REFI",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "REFI",
  payoutToken: "DEFI",
  bondIconSvg: RefiImg,
  bondContractABI: RefiBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  isLOLable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  LOLmessage: "connect",
  isClaimable: {
    [NetworkID.Mainnet]: true,
    [NetworkID.Testnet]: true,
    // [NetworkID.Arbitrum]: false,
    // [NetworkID.ArbitrumTestnet]: false,
    // [NetworkID.Avalanche]: false,
    // [NetworkID.AvalancheTestnet]: false,
  },
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x60350FAbD86a491a50D3B415B67Ef3F07f8773Ae",
      reserveAddress: "0xde734047952e178450237948cdf2ca7f24c37ad5",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const ethBondContract = this.getContractForBond(NetworkId, provider);
    let ethPrice: BigNumberish = await ethBondContract.assetPrice();
    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(NetworkId, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
  customAssetAmountFunc: async function (this: CustomBond, networkID, provider) {
    const token = this.getContractForReserve(networkID, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 9);
    return cvxAmount;
  },
});


// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [refi, busd,ccf,defi_busd,usdt,bnb];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
