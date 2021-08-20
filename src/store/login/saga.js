/**
 * Login saga
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";

import { LOGIN_USER } from "./action-types";
import { loginUserSuccess, loginUserError, setImportSafeFlag } from "./actions";
import { getSafeInfoSuccess } from "../global/actions";
import request from "utils/request";
import { loginEndpoint } from "constants/endpoints";
import { networkId } from "constants/networks";
import { routeGenerators } from "constants/routes/generators";

export function* loginUser({ safeAddress }) {
  const requestURL = `${loginEndpoint}?safeAddress=${safeAddress}&networkId=${networkId}`;
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
      yield put(loginUserSuccess(result.safeAddress, result.log));
      yield put(getSafeInfoSuccess(result.safeInfo));
      yield put(push(routeGenerators.dashboard.root({ safeAddress })));
    }
  } catch (err) {
    yield put(loginUserError(err));
  }
}

export default function* watchLogin() {
  yield takeLatest(LOGIN_USER, loginUser);
}
