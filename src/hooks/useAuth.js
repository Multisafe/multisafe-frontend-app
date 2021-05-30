import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hashMessage } from "@ethersproject/hash";
import { recoverAddress } from "@ethersproject/transactions";
import { MESSAGE_TO_SIGN } from "constants/index";
import { useLocalStorage, useActiveWeb3React } from "./index";
import { setReadOnly } from "store/global/actions";
import { makeSelectOrganisationType } from "store/global/selectors";
import { ORGANISATION_TYPE } from "store/login/resources";

export default function useAuth() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account } = useActiveWeb3React();
  const organisationType = useSelector(makeSelectOrganisationType());

  const dispatch = useDispatch();

  const checkValidSignature = (sign, account) => {
    if (!sign || !account) return false;
    const msgHash = hashMessage(MESSAGE_TO_SIGN);
    const recoveredAddress = recoverAddress(msgHash, sign);
    if (recoveredAddress === account) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const isAuthenticated = checkValidSignature(sign, account);

    const accessToken = localStorage.getItem("token");
    if (isAuthenticated && accessToken) {
      // READ and WRITE
      setIsAuthenticated(true);
      dispatch(setReadOnly(false));
    } else {
      if (organisationType === Number(ORGANISATION_TYPE.PRIVATE)) {
        // No READ ONLY for private org
        setIsAuthenticated(false);
        dispatch(setReadOnly(false));
      } else {
        // READ ONLY for DAOs
        setIsAuthenticated(false);
        dispatch(setReadOnly(true));
      }
    }
  }, [sign, account, dispatch, organisationType]);

  return isAuthenticated;
}
