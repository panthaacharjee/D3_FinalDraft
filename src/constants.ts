import { NodeHelper } from "./helpers/NodeHelper";
import { EnvHelper } from "./helpers/Environment";
import ethereum from "./assets/tokens/wETH.svg";
import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";
import { ReactComponent as ACYC } from "./assets/tokens/ACYC.svg";
import { ReactComponent as MCC } from "./assets/tokens/MCC.svg";
import { ReactComponent as ECC } from "./assets/tokens/ECC.svg";
import { ReactComponent as FFF } from "./assets/tokens/FFF.svg";
import { ReactComponent as SCC } from "./assets/tokens/SCC.svg";
import { ReactComponent as REFI } from "./assets/tokens/refi.svg";
import { ReactComponent as CCF } from "./assets/tokens/CCF.svg";
export const THE_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/drondin/defi-protocol-metrics";
export const EPOCH_INTERVAL = 14400;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

export const TOKEN_DECIMALS = 9;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  97: {
    DAI_ADDRESS: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
    BUSD_ADDRESS: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee", // duplicate
    D3_ADDRESS: "0x4D996cA1B4A9697E30c50099C9F5f1d30bEeE953",
    STAKING_ADDRESS: "0xE8a46747910be8dbC65fe6A0916E9D6b1e290E23",
    STAKING_HELPER_ADDRESS: "0x6758eECbeC08D965d484A0faE53E0ec24e1282b6",
    // OLD_STAKING_ADDRESS: "0x6758eECbeC08D965d484A0faE53E0ec24e1282b6",
    sD3_ADDRESS: "0xfB6Cb6b42e0621520B08a7A1f79Cdf07618a9CD8",
    DISTRIBUTOR_ADDRESS: "0x4b3763061Ee2dB1F1357ec52440369C202EF98E2",
    BONDINGCALC_ADDRESS: "0x4B5654E3352f692300dDCf532d3eAe1f7b91ac37",
    TREASURY_ADDRESS: "0x70DbA5Fe0fc0a481763Dce33a048609EeDBea52c",

    CIRCULATING_SUPPLY_ADDRESS: "0x3F68784370159c26974bed44533A3dAE1DBc92Fb",
    BOND_HELPER: "0x8a1C08cf83e7291C98d7ce0957F8a0e766F892B8",
    WSOHM_ADDRESS: "0xe73384f11Bb748Aa0Bc20f7b02958DF573e6E2ad",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    GOHM_ADDRESS: "0xcF2D6893A1CB459fD6B48dC9C41c6110B968611E",
  },
  56: {
    DAI_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    BUSD_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // duplicate
    D3_ADDRESS: "0xB4c16Ed711c06b84e4312d5f09bcbD88E4F4d3b6",
    STAKING_ADDRESS: "0x53F4a84F320f571D11fc1F078Dd97321Fdda780b",
    STAKING_HELPER_ADDRESS: "0x0A820314e761c18841015f6c7aBB752edB8d604a",
    // OLD_STAKING_ADDRESS: "0x6758eECbeC08D965d484A0faE53E0ec24e1282b6",
    sD3_ADDRESS: "0x34b51Bf2F838f819563E86a1118EECbDf0c31Ea1",
    DISTRIBUTOR_ADDRESS: "0x91a2645A5f18F4b2D85960e1A6165C75E3138A96",
    BONDINGCALC_ADDRESS: "0x45016fa7e9476675fF796F054Abda796126dDA62",
    TREASURY_ADDRESS: "0xA7930111Db88dc1bD9cB3197db535B9AefAFdD92",
    DIVIDEND_ADDRESS: "0x54ec9C5FabAc0F54006BD9ceb65e0f054E529379",
    DIABOND_ADDRESS: "0x2b70D81b1248BBF56Ce289061D484a240902C19C",
    CCF_ADDRESS: "0xdF2BCc1578B2eB8e1382B9938BD7053Aa4eB0FF3",
    CIRCULATING_SUPPLY_ADDRESS: "0x3F68784370159c26974bed44533A3dAE1DBc92Fb",
    BOND_HELPER: "0x8a1C08cf83e7291C98d7ce0957F8a0e766F892B8",
    WSOHM_ADDRESS: "0xd757B746B34512E885CaB18a183fC0916070E5c7",
    REDEEM_HELPER_ADDRESS: "0x167aB542480eCF24EBf90882a28Bd96296D1fD55",
    GOHM_ADDRESS: "0xcF2D6893A1CB459fD6B48dC9C41c6110B968611E",
  },
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: SVGImageElement;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
export const USER_SELECTABLE_NETWORKS = [1, 42161, 43114];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = 43114;

export const NETWORKS: { [key: number]: INetwork } = {
  56: {
    chainName: "Binance Smart Chain Mainnet",
    chainId: 56,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.bscNetURI,
  },
  97: {
    chainName: "Binance Smart Chain Testnet",
    chainId: 97,
    nativeCurrency: {
      name: "TBNB",
      symbol: "TBNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.bscTestnetURI,
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view
interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  97: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: true,
    network: true,
  },
  56: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: true,
    network: true,
  },
};
export const ASSETS = [
  {
    name: "CCF",
    displayName: "CCF",
    bondIconSvg: CCF,
    network: "https://bsc-dataseed1.defibit.io/",
    reserveContractAddress: "0x7f9528b913A99989B88104b633D531241591A358",
    nameForPrice: "cross-chain-farming",
    decimal: 9,
  },
  {
    name: "REFI",
    displayName: "REFI",
    bondIconSvg: REFI,
    network: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    reserveContractAddress: "0xA808B22ffd2c472aD1278088F16D4010E6a54D5F",
    nameForPrice: "refi",
    decimal: 18,
  },
  {
    name: "FFF",
    displayName: "FFF",
    bondIconSvg: FFF,
    network: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    reserveContractAddress: "0xC16B2419494aE0604432297D40CDF0e8d68dE8d6",
    nameForPrice: "food-farmer-finance",
    decimal: 18,
  },
  {
    name: "ECC",
    displayName: "ECC",
    bondIconSvg: ECC,
    network: "https://bsc-dataseed1.defibit.io/",
    reserveContractAddress: "0xc84d8d03aa41ef941721a4d77b24bb44d7c7ac55",
    nameForPrice: "empire-capital-token",
    decimal: 9,
  },
  {
    name: "MCC",
    displayName: "MCC",
    bondIconSvg: MCC,
    network: "https://bsc-dataseed1.defibit.io/",
    reserveContractAddress: "0xC146B7CdBaff065090077151d391f4c96Aa09e0C",
    nameForPrice: "multi-chain-capital-2",
    decimal: 9,
  },
  {
    name: "SCC",
    displayName: "SCC",
    bondIconSvg: SCC,
    network: "https://rpc.ftm.tools/",
    reserveContractAddress: "0xa231D452e4bCA86672FD6109de94688d1E17Aae5",
    nameForPrice: "scary-chain-capital",
    decimal: 9,
  },
  {
    name: "ACYC",
    displayName: "ACYC",
    bondIconSvg: ACYC,
    network: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    reserveContractAddress: "0xB56A1f3310578f23120182Fb2e58c087EFE6e147",
    nameForPrice: "all-coins-yield-capital",
    decimal: 18,
  },
];
