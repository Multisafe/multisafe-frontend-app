export const NETWORK_NAMES = {
  LOCAL: "Local",
  RINKEBY: "Rinkeby",
  ROPSTEN: "Ropsten",
  KOVAN: "Kovan",
  ETHEREUM: "Ethereum Mainnet",
  POLYGON: "Polygon Mainnet",
};

export const CHAIN_IDS = {
  [NETWORK_NAMES.ETHEREUM]: 1,
  [NETWORK_NAMES.ROPSTEN]: 3,
  [NETWORK_NAMES.RINKEBY]: 4,
  [NETWORK_NAMES.KOVAN]: 42,
  [NETWORK_NAMES.POLYGON]: 137,
};

export const NETWORK_NAME_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: NETWORK_NAMES.ETHEREUM,
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: NETWORK_NAMES.RINKEBY,
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: NETWORK_NAMES.POLYGON,
};

export const GAS_TOKEN_SYMBOL_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: "ETH",
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: "ETH",
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: "MATIC",
};

export const BLOCK_EXPLORER_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: "Etherscan",
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: "Etherscan",
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: "Polygonscan",
};

export const SUPPORTED_NETWORK_IDS = [
  CHAIN_IDS[NETWORK_NAMES.ETHEREUM],
  CHAIN_IDS[NETWORK_NAMES.POLYGON],
  CHAIN_IDS[NETWORK_NAMES.RINKEBY],
];

export const NETWORK_DETAILS_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
};
