import Onboard from "bnc-onboard";
import {CHAIN_IDS, NETWORK_NAME_BY_ID, NETWORK_NAMES} from "constants/networks";

const RPC_URLS = {
  [CHAIN_IDS[
    NETWORK_NAMES.ETHEREUM
  ]]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  [CHAIN_IDS[
    NETWORK_NAMES.RINKEBY
  ]]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  [CHAIN_IDS[
    NETWORK_NAMES.POLYGON
  ]]: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
};

const dappId = process.env.REACT_APP_BLOCKNATIVE_API_KEY;

const checkLedgerSupport = (networkId) => {
  return NETWORK_NAME_BY_ID[networkId] === NETWORK_NAMES.ETHEREUM;
}
const checkTrezorSupport = (networkId) => {
  return NETWORK_NAME_BY_ID[networkId] === NETWORK_NAMES.ETHEREUM;
}

export const getWalletConfigs = (networkId) => {
  const rpcUrl = RPC_URLS[networkId];

  return {
    wallets: [
      { walletName: "metamask" },
      ...(checkLedgerSupport(networkId) ? [{
        walletName: "ledger",
        rpcUrl,
      },] : []),
      ...(checkTrezorSupport(networkId) ? [{
        walletName: "trezor",
        appUrl: "https://reactdemo.blocknative.com",
        email: "aaron@blocknative.com",
        rpcUrl,
      }] : []),
      // {
      //   walletName: "walletConnect",
      //   infuraKey: process.env.REACT_APP_INFURA_TOKEN,
      // },
      { walletName: "coinbase" }
    ]
  }
}

export function initOnboard(networkId, subscriptions) {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    // darkMode: true,
    subscriptions,
    walletSelect: getWalletConfigs(networkId),
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "connect" },
      { checkName: "accounts" },
      // { checkName: "network" },
      { checkName: "balance", minimumBalance: "0" },
    ],
  });
}
