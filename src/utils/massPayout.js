// Module for all tokens supported in mass payout

import { tokens } from "constants/index";
import addresses from "constants/addresses";

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
