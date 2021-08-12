import { useEffect, useRef } from "react";
import { useAuth } from "hooks";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "store/logout/actions";
import { useActiveWeb3React } from "hooks";
import {
  makeSelectIsReadOnly,
  makeSelectSafeInfoSuccess,
} from "store/global/selectors";

export default function Authenticated({ children }) {
  const { onboard } = useActiveWeb3React();
  const isAuthenticated = useAuth();
  const authRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const success = useSelector(makeSelectSafeInfoSuccess());

  authRef.current = isAuthenticated || isReadOnly;

  useEffect(() => {
    setTimeout(() => {
      if (success && !authRef.current) {
        if (onboard) {
          onboard.walletReset();
        }
        dispatch(logoutUser());
      }
    }, 3500);
  }, [children, history, dispatch, onboard, success]);

  return children;
}
