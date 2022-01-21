import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import USDTIcon from "assets/icons/tokens/USDT-icon.png";
import sAUDIcon from "assets/icons/tokens/sAUD-icon.png";
import maticIcon from "assets/icons/tokens/MATIC-icon.svg";
import DefaultIcon from "assets/icons/tokens/Default-icon.jpg";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";
import { ADDRESSES } from "constants/addresses";

export const DEFAULT_GAS_PRICE = "10000000000"; // 100 gwei
export const ONE_GWEI = "1000000000";

export const MESSAGE_TO_SIGN = "I hereby sign and authorize.";
export const MESSAGE_TO_AUTHENTICATE = "PASSWORD";

export const TOKEN_SYMBOLS = {
  DAI: "DAI",
  USDC: "USDC",
  USDT: "USDT",
  ETH: "ETH",
  sAUD: "sAUD",
  MATIC: "MATIC",
};

export const getDefaultIconIfPossible = ({ symbol, address, icons }) => {
  switch (symbol) {
    case TOKEN_SYMBOLS.DAI:
      return DAIIcon;
    case TOKEN_SYMBOLS.USDC:
      return USDCIcon;
    case TOKEN_SYMBOLS.USDT:
      return USDTIcon;
    case TOKEN_SYMBOLS.sAUD:
      return sAUDIcon;
    case TOKEN_SYMBOLS.ETH:
      return ETHIcon;
    case TOKEN_SYMBOLS.MATIC:
      return maticIcon;
    default:
      if (icons && icons[address]) return icons[address];
      if (icons && icons[symbol]) return icons[symbol];
      return DefaultIcon;
  }
};

export const DEFAULT_TOKEN_DETAILS = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: [
    {
      id: 0,
      name: TOKEN_SYMBOLS.ETH,
      icon: ETHIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.ETHEREUM]].ZERO_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
    {
      id: 1,
      name: TOKEN_SYMBOLS.DAI,
      icon: DAIIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.ETHEREUM]].DAI_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
    {
      id: 2,
      name: TOKEN_SYMBOLS.USDC,
      icon: USDCIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.ETHEREUM]].USDC_ADDRESS,
      decimals: 6,
      usdConversionRate: 1,
    },
    {
      id: 3,
      name: TOKEN_SYMBOLS.USDT,
      icon: USDTIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.ETHEREUM]].USDT_ADDRESS,
      decimals: 6,
      usdConversionRate: 1,
    },
  ],
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: [
    {
      id: 0,
      name: TOKEN_SYMBOLS.ETH,
      icon: ETHIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.RINKEBY]].ZERO_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
    {
      id: 1,
      name: TOKEN_SYMBOLS.DAI,
      icon: DAIIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.RINKEBY]].DAI_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
    {
      id: 2,
      name: TOKEN_SYMBOLS.USDC,
      icon: USDCIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.RINKEBY]].USDC_ADDRESS,
      decimals: 6,
      usdConversionRate: 1,
    },
    {
      id: 3,
      name: TOKEN_SYMBOLS.USDT,
      icon: USDTIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.RINKEBY]].USDT_ADDRESS,
      decimals: 6,
      usdConversionRate: 1,
    },
  ],
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: [
    {
      id: 0,
      name: TOKEN_SYMBOLS.MATIC,
      icon: maticIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.POLYGON]].ZERO_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
    {
      id: 1,
      name: TOKEN_SYMBOLS.DAI,
      icon: DAIIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.POLYGON]].DAI_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
    {
      id: 2,
      name: TOKEN_SYMBOLS.USDC,
      icon: USDCIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.POLYGON]].USDC_ADDRESS,
      decimals: 6,
      usdConversionRate: 1,
    },
    {
      id: 3,
      name: TOKEN_SYMBOLS.USDT,
      icon: USDTIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.POLYGON]].USDT_ADDRESS,
      decimals: 6,
      usdConversionRate: 1,
    },
    {
      id: 4,
      name: TOKEN_SYMBOLS.ETH,
      icon: ETHIcon,
      balance: 0,
      usd: 0,
      address: ADDRESSES[CHAIN_IDS[NETWORK_NAMES.POLYGON]].WETH_ADDRESS,
      decimals: 18,
      usdConversionRate: 1,
    },
  ],
};

export const WALLET_STATES = {
  UNDETECTED: "UNDETECTED",
  CONNECTED: "CONNECTED",
  NOT_CONNECTED: "NOT_CONNECTED",
};
