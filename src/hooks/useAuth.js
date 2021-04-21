import { useEffect, useState } from "react";
import { hashMessage } from "@ethersproject/hash";
import { recoverAddress } from "@ethersproject/transactions";
import { MESSAGE_TO_SIGN } from "constants/index";
import { useLocalStorage, useActiveWeb3React } from "./index";

export default function useAuth() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account } = useActiveWeb3React();

  const checkValidSignature = (sign, account) => {
    if (!sign) return false;
    const msgHash = hashMessage(MESSAGE_TO_SIGN);
    const recoveredAddress = recoverAddress(msgHash, sign);
    if (recoveredAddress === account) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // TODO: Redirect to login page if the account is undefined
    // account is loaded with a delay, so we can't directly redirect if account === undefined
    // Potential fix: check for account after timeout. if still undefined, log out
    if (account) {
      const isAuthenticated = checkValidSignature(sign, account);
      // if (!isAuthenticated) {
      //   history.push("/"); // login
      // } else {
      //   setIsAuthenticated(true);
      // }
      const accessToken = localStorage.getItem("token");
      if (isAuthenticated && accessToken) {
        setIsAuthenticated(true);
      }
    }
  }, [sign, account]);

  return isAuthenticated;
}
