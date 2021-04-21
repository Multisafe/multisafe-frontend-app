// Module for all tokens supported in mass payout

import { tokens } from "constants/index";
import addresses from "constants/addresses";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
// import USDTIcon from "assets/icons/tokens/USDT-icon.png";

const { DAI_ADDRESS, USDC_ADDRESS, USDT_ADDRESS } = addresses;

const functionNames = {
  swapTokensForExactTokens: "swapTokensForExactTokens",
};

export const getConfigByTokenNames = (tokenTo, tokenFrom) => {
  // for all erc20 token swaps
  // path = [tokenFrom address, tokenTo address]
  return {
    functionName: functionNames.swapTokensForExactTokens,
    path: [tokenNameToAddress[tokenFrom], tokenNameToAddress[tokenTo]],
  };
};

export const tokenNameToAddress = {
  [tokens.DAI]: DAI_ADDRESS,
  [tokens.USDC]: USDC_ADDRESS,
  [tokens.USDT]: USDT_ADDRESS,
  // add other tokens and addresses here
};

export const constructLabel = (value, icon) => {
  return (
    <div className="d-flex align-items-center">
      <img src={icon} alt={value} width="18" />
      <div className="ml-2">{value}</div>
    </div>
  );
};

export const defaultTokenOptions = [
  {
    value: tokens.DAI,
    label: constructLabel(tokens.DAI, DAIIcon),
  },
  {
    value: "USDC",
    label: constructLabel(tokens.USDC, USDCIcon),
  },
  // {
  //   value: "USDT",
  //   label: constructLabel(tokens.USDT, USDTIcon),
  // },
];
