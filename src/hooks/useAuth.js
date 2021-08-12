import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

import { useLocalStorage } from "./index";
import { setReadOnly } from "store/global/actions";
import {
  makeSelectOrganisationType,
  makeSelectIsOwner,
  makeSelectIsDataSharingAllowed,
  makeSelectSafeInfoSuccess,
} from "store/global/selectors";
import { ORGANISATION_TYPE } from "store/login/resources";
import { logoutUser } from "store/logout/actions";

export default function useAuth() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const organisationType = useSelector(makeSelectOrganisationType());
  const dataSharingAllowed = useSelector(makeSelectIsDataSharingAllowed());
  const isOwner = useSelector(makeSelectIsOwner());
  const success = useSelector(makeSelectSafeInfoSuccess());

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
        return false;
      }
    },
    [params]
  );

  useEffect(() => {
    if (success) {
      if (isOwner) {
        setIsAuthenticated(true);
        dispatch(setReadOnly(false));
      } else {
        setIsAuthenticated(false);
        if (dataSharingAllowed) {
          dispatch(setReadOnly(true));
        } else {
          // if (organisationType === ORGANISATION_TYPE.PRIVATE)
          //   dispatch(logoutUser());
          dispatch(setReadOnly(false));
        }
      }

      // const accessToken = localStorage.getItem("token");
      // const isAuthenticated = checkValidAccessToken(accessToken);
      // const isAuthenticated = true;

      // TODO: refactor if/else
      // if (isAuthenticated) {
      //   setIsAuthenticated(true);
      //   if (isOwner) {
      //     // READ and WRITE
      //     dispatch(setReadOnly(false));
      //   } else if (
      //     !isOwner &&
      //     organisationType === Number(ORGANISATION_TYPE.PRIVATE)
      //   ) {
      //     // No READ ONLY for private org
      //     setIsAuthenticated(false);
      //     dispatch(setReadOnly(false));
      //   } else {
      //     // READ ONLY
      //     dispatch(setReadOnly(true));
      //   }
      // } else {
      //   if (organisationType === Number(ORGANISATION_TYPE.PRIVATE)) {
      //     // No READ ONLY for private org
      //     setIsAuthenticated(false);
      //     dispatch(setReadOnly(false));
      //   } else if (!dataSharingAllowed) {
      //     console.log("logging out...");
      //     dispatch(logoutUser());
      //   } else {
      //     // READ ONLY for DAOs
      //     setIsAuthenticated(false);
      //     dispatch(setReadOnly(true));
      //   }
      // }
    }
  }, [dispatch, dataSharingAllowed, isOwner, success, organisationType]);

  return isAuthenticated;
}
