import Onboard from "bnc-onboard";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";

const RPC_URLS = {
  [CHAIN_IDS[
    NETWORK_NAMES.MAINNET
  ]]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  [CHAIN_IDS[
    NETWORK_NAMES.RINKEBY
  ]]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  [CHAIN_IDS[
    NETWORK_NAMES.POLYGON
  ]]: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
};

const dappId = process.env.REACT_APP_BLOCKNATIVE_API_KEY;

export function initOnboard(networkId, subscriptions) {
  const rpcUrl = RPC_URLS[networkId];

  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    // darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: "metamask" },
        {
          walletName: "trezor",
          appUrl: "https://reactdemo.blocknative.com",
          email: "aaron@blocknative.com",
          rpcUrl,
        },
        {
          walletName: "ledger",
          rpcUrl,
        },
        // {
        //   walletName: "walletConnect",
        //   infuraKey: process.env.REACT_APP_INFURA_TOKEN,
        // },
        { walletName: "coinbase" },
        { walletName: "fortmatic", apiKey: "pk_test_886ADCAB855632AA" },
      ],
    },
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "connect" },
      { checkName: "accounts" },
      // { checkName: "network" },
      { checkName: "balance", minimumBalance: "0" },
    ],
  });
}
