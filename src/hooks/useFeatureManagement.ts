import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";
import useActiveWeb3React from "./useActiveWeb3React";
import { useSelector } from "react-redux";
import { makeSelectIsMultiOwner } from "../store/global/selectors";

export const FEATURE_NAMES = {
  SPENDING_LIMIT: "SPENDING_LIMIT",
  TOKEN_SWAP: "TOKEN_SWAP",
};

export const useFeatureManagement = () => {
  const { chainId } = useActiveWeb3React();
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  const ENABLED_FEATURES = {
    [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: !isMultiOwner,
      [FEATURE_NAMES.SPENDING_LIMIT]: true,
    },
    [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: false,
      [FEATURE_NAMES.SPENDING_LIMIT]: true,
    },
    [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: !isMultiOwner,
      [FEATURE_NAMES.SPENDING_LIMIT]: false,
    },
    [CHAIN_IDS[NETWORK_NAMES.BSC]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: false,
      [FEATURE_NAMES.SPENDING_LIMIT]: false,
    },
    [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: false,
      [FEATURE_NAMES.SPENDING_LIMIT]: false,
    },
    [CHAIN_IDS[NETWORK_NAMES.GNOSIS]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: false,
      [FEATURE_NAMES.SPENDING_LIMIT]: false,
    },
    [CHAIN_IDS[NETWORK_NAMES.ARBITRUM]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: false,
      [FEATURE_NAMES.SPENDING_LIMIT]: false,
    },
    [CHAIN_IDS[NETWORK_NAMES.OPTIMISM]]: {
      [FEATURE_NAMES.TOKEN_SWAP]: false,
      [FEATURE_NAMES.SPENDING_LIMIT]: false,
    },
  };

  const isFeatureEnabled = (featureName: string) =>
    ENABLED_FEATURES[chainId]?.[featureName] || false;

  return {
    isFeatureEnabled,
  };
};
