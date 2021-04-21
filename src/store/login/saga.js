/**
 * Login saga
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";
import jwt_decode from "jwt-decode";

import { LOGIN_USER } from "./action-types";
import { loginUserSuccess, loginUserError, setImportSafeFlag } from "./actions";
import { setOrganisationType, setOwnersAndThreshold } from "../global/actions";
import request from "utils/request";
// import { makeSelectUsername } from "containers/HomePage/selectors";
import { loginEndpoint } from "constants/endpoints";
import { networkId } from "constants/networks";

export function* loginUser(action) {
  // Select username from store
  // const username = yield select(makeSelectUsername());
  const requestURL = `${loginEndpoint}?safeAddress=${action.safeAddress}&networkId=${networkId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 145) {
      yield put(setImportSafeFlag(result.flag));
    } else if (result.flag !== 200) {
      // Error in payload
      yield put(loginUserError(result.log));
    } else {
      localStorage.setItem("token", result.access_token);
      let decoded;
      try {
        decoded = jwt_decode(result.access_token);
      } catch (err) {
        yield put(loginUserError(`Invalid JWT token.`));
        return;
      }

      yield put(setOwnersAndThreshold(decoded.owners, decoded.threshold));
      yield put(setOrganisationType(decoded.organisationType));
      yield put(loginUserSuccess(result.transactionHash, result.log));
      yield put(push("/dashboard"));
    }
  } catch (err) {
    yield put(loginUserError(err));
  }
}

export default function* watchLogin() {
  yield takeLatest(LOGIN_USER, loginUser);
}
