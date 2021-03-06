import Onboard from "bnc-onboard";
import { networkId } from "constants/networks";

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
};

const rpcUrl = RPC_URLS[networkId];
const dappId = process.env.REACT_APP_BLOCKNATIVE_API_KEY;

export function initOnboard(subscriptions) {
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
