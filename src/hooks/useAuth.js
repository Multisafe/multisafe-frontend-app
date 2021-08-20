import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useLocalStorage } from "./index";
import { setReadOnly } from "store/global/actions";
import {
  makeSelectIsDataSharingAllowed,
  makeSelectOwnerSafeAddress,
  makeSelectSafeInfoSuccess,
} from "store/global/selectors";
import { logoutUser } from "store/logout/actions";
import useActiveWeb3React from "./useActiveWeb3React";
import { WALLET_STATES } from "constants/index";
import { checkValidSignature } from "utils/checkAuth";
import { routeGenerators } from "constants/routes/generators";

export default function useAuth() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletState, setWalletState] = useState(WALLET_STATES.UNDETECTED);

  const dataSharingAllowed = useSelector(makeSelectIsDataSharingAllowed());
  const safeInfoSuccess = useSelector(makeSelectSafeInfoSuccess());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  const { onboard, account } = useActiveWeb3React();

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    async function checkWalletStatus() {
      if (onboard) {
        try {
          const previouslySelectedWallet =
            window.localStorage.getItem("selectedWallet");

          await onboard.walletSelect(previouslySelectedWallet || undefined);

          const ready = await onboard.walletCheck();

          if (ready) {
            setWalletState(WALLET_STATES.CONNECTED);
          } else {
            return setWalletState(WALLET_STATES.NOT_CONNECTED);
          }
        } catch (err) {
          console.error(err);
          setWalletState(WALLET_STATES.NOT_CONNECTED);
        }
      }
    }

    checkWalletStatus();
  }, [onboard]);

  const resetAndLogout = useCallback(() => {
    setIsAuthenticated(false);
    dispatch(setReadOnly(false));
    if (onboard) {
      onboard.walletReset();
    }
    console.log("Unauthorized. Logging out...");
    dispatch(logoutUser());
  }, [onboard, dispatch]);

  const doReadOnlyChecks = useCallback(() => {
    // if checks pass, Read only. Else, logout
    if (safeInfoSuccess) {
      if (dataSharingAllowed) {
        setIsAuthenticated(false);
        dispatch(setReadOnly(true));
      } else {
        resetAndLogout();
      }
    }
  }, [dataSharingAllowed, dispatch, safeInfoSuccess, resetAndLogout]);

  useEffect(() => {
    if (walletState === WALLET_STATES.CONNECTED && account) {
      const isValidSignature = checkValidSignature(sign, account);
      // const isValidAccessToken = checkValidAccessToken(safeAddress);
      // TODO: check account inside access token as well

      if (isValidSignature) {
        // authenticated
        setIsAuthenticated(true);
        dispatch(setReadOnly(false));
      } else {
        // Please sign & login to view the dashboard
        history.push(routeGenerators.verifyUser({ safeAddress }));

        // resetAndLogout();
        setIsAuthenticated(false);
        dispatch(setReadOnly(true));
      }
    } else if (walletState === WALLET_STATES.NOT_CONNECTED) {
      doReadOnlyChecks();
    }
  }, [
    dispatch,
    history,
    account,
    sign,
    walletState,
    safeAddress,
    doReadOnlyChecks,
    resetAndLogout,
  ]);

  return { isAuthenticated, walletState };
}
