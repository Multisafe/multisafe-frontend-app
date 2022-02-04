import { CHAIN_IDS, NETWORK_NAMES } from "./networks";

// rinkeby
const RINKEBY_PROXY_FACTORY_ADDRESS =
  "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";
const RINKEBY_GNOSIS_SAFE_ADDRESS =
  "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552";
const RINKEBY_DAI_ADDRESS = "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8";
const RINKEBY_USDC_ADDRESS = "0x472d88e5246d9bF2AB925615fc580336430679Ae";
const RINKEBY_USDT_ADDRESS = "0x897886a7d886349723Bf485502d8513CeC3350Ba";
const RINKEBY_WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
const RINKEBY_MULTISEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761";
const RINKEBY_UNISWAP_ROUTER_ADDRESS =
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const RINKEBY_ALLOWANCE_MODULE_ADDRESS =
  "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134";

// mainnet
const MAINNET_PROXY_FACTORY_ADDRESS =
  "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";
const MAINNET_GNOSIS_SAFE_ADDRESS =
  "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552";
const MAINNET_USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const MAINNET_USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const MAINNET_DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const MAINNET_WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const MAINNET_MULTISEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761";
const MAINNET_UNISWAP_ROUTER_ADDRESS =
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const MAINNET_ALLOWANCE_MODULE_ADDRESS =
  "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134";

const COINSHIFT_FEE_ADDRESS = "0x5970892478aC8987B7069819eE307D0C255528cc";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const DEFAULT_ADDRESSES = {
  ZERO_ADDRESS,
  SENTINEL_ADDRESS: "0x0000000000000000000000000000000000000001",
};

export const ADDRESSES = {
  [CHAIN_IDS[NETWORK_NAMES.ETHEREUM]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS,
    PROXY_FACTORY_ADDRESS: MAINNET_PROXY_FACTORY_ADDRESS,
    GNOSIS_SAFE_ADDRESS: MAINNET_GNOSIS_SAFE_ADDRESS,
    DAI_ADDRESS: MAINNET_DAI_ADDRESS,
    USDC_ADDRESS: MAINNET_USDC_ADDRESS,
    USDT_ADDRESS: MAINNET_USDT_ADDRESS,
    WETH_ADDRESS: MAINNET_WETH_ADDRESS,
    MULTISEND_ADDRESS: MAINNET_MULTISEND_ADDRESS,
    UNISWAP_ROUTER_ADDRESS: MAINNET_UNISWAP_ROUTER_ADDRESS,
    ALLOWANCE_MODULE_ADDRESS: MAINNET_ALLOWANCE_MODULE_ADDRESS,
  },
  [CHAIN_IDS[NETWORK_NAMES.RINKEBY]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS,
    PROXY_FACTORY_ADDRESS: RINKEBY_PROXY_FACTORY_ADDRESS,
    GNOSIS_SAFE_ADDRESS: RINKEBY_GNOSIS_SAFE_ADDRESS,
    DAI_ADDRESS: RINKEBY_DAI_ADDRESS,
    USDC_ADDRESS: RINKEBY_USDC_ADDRESS,
    USDT_ADDRESS: RINKEBY_USDT_ADDRESS,
    WETH_ADDRESS: RINKEBY_WETH_ADDRESS,
    MULTISEND_ADDRESS: RINKEBY_MULTISEND_ADDRESS,
    UNISWAP_ROUTER_ADDRESS: RINKEBY_UNISWAP_ROUTER_ADDRESS,
    ALLOWANCE_MODULE_ADDRESS: RINKEBY_ALLOWANCE_MODULE_ADDRESS,
  },
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS: "0xe44257ec3c1767074f9d0A648073Eb1e6D369f8a",
    PROXY_FACTORY_ADDRESS: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    GNOSIS_SAFE_ADDRESS: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    MULTISEND_ADDRESS: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    DAI_ADDRESS: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    USDC_ADDRESS: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT_ADDRESS: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    WETH_ADDRESS: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    ALLOWANCE_MODULE_ADDRESS: "", // add correct address
  },
  [CHAIN_IDS[NETWORK_NAMES.BSC]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS: "",
    PROXY_FACTORY_ADDRESS: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    GNOSIS_SAFE_ADDRESS: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    MULTISEND_ADDRESS: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    BUSD_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    DAI_ADDRESS: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    USDC_ADDRESS: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    USDT_ADDRESS: "0x55d398326f99059ff775485246999027b3197955",
    WBNB_ADDRESS: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    ALLOWANCE_MODULE_ADDRESS: "", // add correct address
  },
  [CHAIN_IDS[NETWORK_NAMES.AVALANCHE]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS: "",
    PROXY_FACTORY_ADDRESS: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
    GNOSIS_SAFE_ADDRESS: "0x69f4D1788e39c87893C980c06EdF4b7f686e2938",
    MULTISEND_ADDRESS: "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    DAI_ADDRESS: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    USDC_ADDRESS: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    USDT_ADDRESS: "0xc7198437980c041c805a1edcba50c1ce5db95118",
    ALLOWANCE_MODULE_ADDRESS: "", // add correct address
  },
  [CHAIN_IDS[NETWORK_NAMES.GNOSIS]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS: "",
    PROXY_FACTORY_ADDRESS: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    GNOSIS_SAFE_ADDRESS: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    MULTISEND_ADDRESS: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    USDC_ADDRESS: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    USDT_ADDRESS: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
    ALLOWANCE_MODULE_ADDRESS: "", // add correct address
  },
  [CHAIN_IDS[NETWORK_NAMES.ARBITRUM]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS: "",
    PROXY_FACTORY_ADDRESS: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    GNOSIS_SAFE_ADDRESS: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    MULTISEND_ADDRESS: "0x3E5c63644E683549055b9Be8653de26E0B4CD36E",
    DAI_ADDRESS: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    USDC_ADDRESS: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    USDT_ADDRESS: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
    ALLOWANCE_MODULE_ADDRESS: "", // add correct address
  },
  [CHAIN_IDS[NETWORK_NAMES.OPTIMISM]]: {
    ...DEFAULT_ADDRESSES,
    COINSHIFT_FEE_ADDRESS: "",
    PROXY_FACTORY_ADDRESS: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
    GNOSIS_SAFE_ADDRESS: "0x69f4D1788e39c87893C980c06EdF4b7f686e2938",
    MULTISEND_ADDRESS: "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA",
    DAI_ADDRESS: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    USDC_ADDRESS: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    USDT_ADDRESS: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    ALLOWANCE_MODULE_ADDRESS: "", // add correct address
  },
};
