export const NETWORK_NAMES = {
  LOCAL: "Local",
  RINKEBY: "Rinkeby",
  ROPSTEN: "Ropsten",
  KOVAN: "Kovan",
  ETHEREUM: "Ethereum Mainnet",
  POLYGON: "Polygon Mainnet",
  BSC: "BSC",
  AVALANCHE: "Avalanche",
};

export const CHAIN_IDS = {
  [NETWORK_NAMES.ETHEREUM]: 1,
  [NETWORK_NAMES.ROPSTEN]: 3,
  [NETWORK_NAMES.RINKEBY]: 4,
  [NETWORK_NAMES.KOVAN]: 42,
  [NETWORK_NAMES.POLYGON]: 137,
  [NETWORK_NAMES.BSC]: 56,
  [NETWORK_NAMES.AVALANCHE]: 43114,
};

export const NETWORK_NAME_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: NETWORK_NAMES.ETHEREUM,
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: NETWORK_NAMES.RINKEBY,
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: NETWORK_NAMES.POLYGON,
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: NETWORK_NAMES.BSC,
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: NETWORK_NAMES.AVALANCHE,
};

export const GAS_TOKEN_SYMBOL_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: "ETH",
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: "ETH",
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: "MATIC",
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: "BNB",
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: "AVAX",
};

export const BLOCK_EXPLORER_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: "Etherscan",
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: "Etherscan",
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: "Polygonscan",
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: "Bscscan",
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: "Snowtrace",
};

export const SUPPORTED_NETWORK_IDS = [
  CHAIN_IDS[NETWORK_NAMES.ETHEREUM],
  CHAIN_IDS[NETWORK_NAMES.POLYGON],
  CHAIN_IDS[NETWORK_NAMES.BSC],
  CHAIN_IDS[NETWORK_NAMES.AVALANCHE],
  CHAIN_IDS[NETWORK_NAMES.RINKEBY],
];

export const NETWORK_DETAILS_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: {
    chainId: CHAIN_IDS[NETWORK_NAMES.POLYGON],
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: {
    chainId: CHAIN_IDS[NETWORK_NAMES.BSC],
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: {
    chainId: CHAIN_IDS[NETWORK_NAMES.AVALANCHE],
    chainName: "Avalanche Mainnet",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"],
  },
};
