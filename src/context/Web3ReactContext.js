import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";

import {initOnboard} from "utils/initOnboard";
import { useLocalStorage } from "hooks";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";

export const Web3ReactContext = createContext();

export default function Web3ReactProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wallet, setWallet] = useState({});
  const [provider, setProvider] = useState(null);

  const [onboard, setOnboard] = useState(null);

  const [appChainId, setAppChainId] = useLocalStorage(
    "NETWORK_ID",
    CHAIN_IDS[NETWORK_NAMES.ETHEREUM]
  );

  useEffect(() => {
    if (!onboard) {
      setAppChainId(CHAIN_IDS[NETWORK_NAMES.ETHEREUM]);

      const onboard = initOnboard(appChainId, {
        address: setAddress,
        network: setNetwork,
        balance: setBalance,
        wallet: (wallet) => {
          if (wallet.provider) {
            setWallet(wallet);
            console.log(`${wallet.name} is connected`);

            const ethersProvider = new ethers.providers.Web3Provider(
              wallet.provider,
              "any"
            );

            setProvider(ethersProvider);

            window.localStorage.setItem("selectedWallet", wallet.name);
          } else {
            setProvider(null);
            setWallet({});
          }
        },
      });

      setOnboard(onboard);
    } else {
      onboard.config({ networkId: appChainId });
    }
  }, [onboard, appChainId]);

  // useEffect(() => {
  //   const previouslySelectedWallet =
  //     window.localStorage.getItem("selectedWallet");

  //   if (previouslySelectedWallet && onboard) {
  //     onboard.walletSelect(previouslySelectedWallet);
  //   }
  // }, [onboard]);

  const setChainId = (chainId) => {
    setAppChainId(chainId);
  };

  return (
    <Web3ReactContext.Provider
      value={{
        onboard,
        account: address ? ethers.utils.getAddress(address) : undefined,
        walletChainId: network,
        library: provider,
        connector: wallet,
        active: address && balance ? true : false,
        chainId: appChainId,
        setChainId,
      }}
    >
      {children}
    </Web3ReactContext.Provider>
  );
}
