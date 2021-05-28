import { useEffect, useRef } from "react";
import { useAuth } from "hooks";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logoutUser } from "store/logout/actions";
import { useActiveWeb3React } from "hooks";

export default function Authenticated({ children }) {
  const { onboard } = useActiveWeb3React();
  const isAuthenticated = useAuth();
  const authRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  authRef.current = isAuthenticated;

  useEffect(() => {
    setTimeout(() => {
      if (!authRef.current) {
        if (onboard) {
          onboard.walletReset();
        }
        dispatch(logoutUser());
      }
      return children;
    }, 3500);
  }, [children, history, dispatch, onboard]);

  return children;
}
