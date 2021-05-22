import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import USDTIcon from "assets/icons/tokens/USDT-icon.png";
import sAUDIcon from "assets/icons/tokens/sAUD-icon.png";
import DefaultIcon from "assets/icons/tokens/Default-icon.jpg";
import addresses from "./addresses";

export const isMainnet = process.env.REACT_APP_NETWORK_NAME === "MAINNET";
export const isTestnet = process.env.REACT_APP_NETWORK_NAME !== "MAINNET";

export const DEFAULT_GAS_PRICE = "10000000000"; // 100 gwei
export const ONE_GWEI = "100000000";

export const MESSAGE_TO_SIGN = "I hereby sign and authorize.";

export const tokens = {
  DAI: "DAI",
  USDC: "USDC",
  USDT: "USDT",
  ETH: "ETH",
  sAUD: "sAUD",
};

export const getDefaultIconIfPossible = (tokenSymbol, icons) => {
  switch (tokenSymbol) {
    case tokens.DAI:
      return DAIIcon;
    case tokens.USDC:
      return USDCIcon;
    case tokens.USDT:
      return USDTIcon;
    case tokens.sAUD:
      return sAUDIcon;
    case tokens.ETH:
      return ETHIcon;
    default:
      if (icons && icons[tokenSymbol]) return icons[tokenSymbol];
      return DefaultIcon;
  }
};

export const defaultTokenDetails = [
  {
    id: 0,
    name: tokens.ETH,
    icon: ETHIcon,
    balance: 0,
    usd: 0,
    address: addresses.ZERO_ADDRESS,
    decimals: 18,
    usdConversionRate: 1,
  },
  {
    id: 1,
    name: tokens.DAI,
    icon: DAIIcon,
    balance: 0,
    usd: 0,
    address: addresses.DAI_ADDRESS,
    decimals: 18,
    usdConversionRate: 1,
  },
  {
    id: 2,
    name: tokens.USDC,
    icon: USDCIcon,
    balance: 0,
    usd: 0,
    address: addresses.USDC_ADDRESS,
    decimals: 6,
    usdConversionRate: 1,
  },
  {
    id: 3,
    name: tokens.USDT,
    icon: USDTIcon,
    balance: 0,
    usd: 0,
    address: addresses.USDT_ADDRESS,
    decimals: 6,
    usdConversionRate: 1,
  },
];
