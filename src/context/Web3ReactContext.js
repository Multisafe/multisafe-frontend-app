import { useEffect, useState, createContext } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";

import { initOnboard } from "utils/initOnboard";
export const Web3ReactContext = createContext();

export default function Web3ReactProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wallet, setWallet] = useState({});
  const [provider, setProvider] = useState(null);

  const [onboard, setOnboard] = useState(null);

  // const [darkMode, setDarkMode] = useState(false)
  // const [desktopPosition, setDesktopPosition] = useState('bottomRight')
  // const [mobilePosition, setMobilePosition] = useState('top')

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: (wallet) => {
        if (wallet.provider) {
          setWallet(wallet);
          console.log(`${wallet.name} is connected`);

          const ethersProvider = new Web3Provider(wallet.provider);

          // provider = ethersProvider;
          setProvider(ethersProvider);

          window.localStorage.setItem("selectedWallet", wallet.name);
        } else {
          // provider = null;
          setProvider(null);
          setWallet({});
        }
      },
    });

    setOnboard(onboard);
  }, []);

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem(
      "selectedWallet"
    );

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard]);

  return (
    <Web3ReactContext.Provider
      value={{
        onboard,
        account: address ? getAddress(address) : undefined,
        chainId: network,
        library: provider,
        connector: wallet,
        active: address && balance ? true : false,
      }}
    >
      {children}
    </Web3ReactContext.Provider>
  );
}
