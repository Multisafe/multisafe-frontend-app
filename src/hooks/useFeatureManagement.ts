import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";
import useActiveWeb3React from "./useActiveWeb3React";

export const FEATURE_NAMES = {
  SPENDING_LIMIT: "SPENDING_LIMIT",
  TOKEN_SWAP: "TOKEN_SWAP",
};

const ENABLED_FEATURES = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: {
    [FEATURE_NAMES.TOKEN_SWAP]: true,
    [FEATURE_NAMES.SPENDING_LIMIT]: true,
  },
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: {
    [FEATURE_NAMES.TOKEN_SWAP]: false,
    [FEATURE_NAMES.SPENDING_LIMIT]: true,
  },
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: {
    [FEATURE_NAMES.TOKEN_SWAP]: true,
    [FEATURE_NAMES.SPENDING_LIMIT]: false,
  },
};

export const useFeatureManagement = () => {
  const { chainId } = useActiveWeb3React();

  const isFeatureEnabled = (featureName: string) =>
    ENABLED_FEATURES[chainId][featureName];

  return {
    isFeatureEnabled,
  };
};