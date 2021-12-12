import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";

export function getNetworkNameById(chainId: number) {
  switch (chainId) {
    case CHAIN_IDS[NETWORK_NAMES.MAINNET]:
      return NETWORK_NAMES.MAINNET;
    case CHAIN_IDS[NETWORK_NAMES.ROPSTEN]:
      return NETWORK_NAMES.ROPSTEN;
    case CHAIN_IDS[NETWORK_NAMES.RINKEBY]:
      return NETWORK_NAMES.RINKEBY;
    case CHAIN_IDS[NETWORK_NAMES.KOVAN]:
      return NETWORK_NAMES.KOVAN;
    case CHAIN_IDS[NETWORK_NAMES.POLYGON]:
      return NETWORK_NAMES.POLYGON;
    default:
      return "Unknown Network";
  }
}
