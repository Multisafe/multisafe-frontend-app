import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

import { useLocalStorage, useActiveWeb3React } from "./index";
import { setReadOnly } from "store/global/actions";
import { makeSelectOrganisationType } from "store/global/selectors";
import { ORGANISATION_TYPE } from "store/login/resources";
import { logoutUser } from "store/logout/actions";

export default function useAuth() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account } = useActiveWeb3React();
  const organisationType = useSelector(makeSelectOrganisationType());

  const dispatch = useDispatch();
  const params = useParams();

  const checkValidAccessToken = useCallback(
    (accessToken) => {
      if (!accessToken || !params) return false;
      try {
        const decoded = jwt_decode(accessToken);
        if (decoded.safeAddress !== params.safeAddress) return false;
        return true;
      } catch (err) {
        console.error(err);
        dispatch(logoutUser());
        return false;
      }
    },
    [params, dispatch]
  );

  useEffect(() => {
    if (organisationType !== undefined) {
      const accessToken = localStorage.getItem("token");
      const isAuthenticated = checkValidAccessToken(accessToken);
      if (isAuthenticated) {
        // READ and WRITE
        setIsAuthenticated(true);
        dispatch(setReadOnly(false));
      } else {
        if (organisationType === Number(ORGANISATION_TYPE.PRIVATE)) {
          // No READ ONLY for private org
          setIsAuthenticated(false);
          dispatch(setReadOnly(false));
          dispatch(logoutUser());
        } else {
          // READ ONLY for DAOs
          setIsAuthenticated(false);
          dispatch(setReadOnly(true));
        }
      }
    }
  }, [sign, account, dispatch, organisationType, checkValidAccessToken]);

  return isAuthenticated;
}
