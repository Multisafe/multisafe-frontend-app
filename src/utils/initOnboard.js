import Onboard from "bnc-onboard";
import { networkId } from "constants/networks";

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
};

const rpcUrl = RPC_URLS[networkId];
const apiUrl = process.env.REACT_APP_API_URL;
const dappId = process.env.REACT_APP_BLOCKNATIVE_API_KEY;

export function initOnboard(subscriptions) {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    apiUrl,
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
        {
          walletName: "walletConnect",
          infuraKey: process.env.REACT_APP_INFURA_TOKEN,
        },
        {
          walletName: "lattice",
          appName: "Onboard Demo",
          rpcUrl,
        },
        { walletName: "coinbase" },
        { walletName: "status" },
        { walletName: "walletLink", rpcUrl },
        {
          walletName: "portis",
          apiKey: "b2b7586f-2b1e-4c30-a7fb-c2d1533b153b",
        },
        { walletName: "fortmatic", apiKey: "pk_test_886ADCAB855632AA" },
        { walletName: "torus" },
        { walletName: "authereum", disableNotifications: true },
      ],
    },
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "connect" },
      { checkName: "accounts" },
      { checkName: "network" },
      { checkName: "balance", minimumBalance: "0" },
    ],
  });
}
