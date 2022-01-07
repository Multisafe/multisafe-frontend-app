import { call, put, fork, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";

import {
  CREATE_META_TX,
  REGISTER_USER,
  GET_VERIFICATION_STATUS,
} from "./action-types";
import {
  registerUserSuccess,
  registerUserError,
  createMetaTxError,
  createMetaTxSuccess,
  getVerificationStatusSuccess,
  getVerificationStatusError,
} from "./actions";
import {request} from "utils/request";
import {
  registerEndpoint,
  createMetaTxEndpoint,
  getVerificationStatusEndpoint,
} from "constants/endpoints";
import { routeGenerators } from "constants/routes/generators";

export function* registerUser(action) {
  const requestURL = registerEndpoint;
  const options = {
    method: "POST",
    body: JSON.stringify({ ...action.body, networkId: action.networkId }),
  };

  try {
    // Call our request helper (see 'utils/request')
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(registerUserError(result.log));
    } else {
      // set auth token
      localStorage.setItem("token", result.access_token);
      yield put(registerUserSuccess(result.transactionHash, result.log));
      yield put(
        push(
          routeGenerators.dashboard.root({
            safeAddress: action.body.safeAddress,
          })
        )
      );
    }
  } catch (err) {
    yield put(registerUserError(err.message));
  }
}

export function* createMetaTx(action) {
  const requestURL = createMetaTxEndpoint;
  const options = {
    method: "POST",
    body: JSON.stringify({ ...action.body, networkId: action.networkId }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(createMetaTxError(result.log));
    } else {
      yield put(createMetaTxSuccess(result.transactionHash, result.log));
    }
  } catch (err) {
    yield put(createMetaTxError(err.message));
  }
}

export function* fetchVerificationStatus({ password, owner }) {
  const requestURL = new URL(getVerificationStatusEndpoint);
  const params = [
    ["password", password],
    ["owner", owner],
  ];

  requestURL.search = new URLSearchParams(params).toString();

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getVerificationStatusError(result.log));
    } else {
      yield put(getVerificationStatusSuccess(result.isVerified, result.log));
    }
  } catch (err) {
    yield put(getVerificationStatusError(err.message));
  }
}

function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerUser);
}

function* watchCreateMetaTx() {
  yield takeLatest(CREATE_META_TX, createMetaTx);
}

function* watchGetVerificationStatus() {
  yield takeLatest(GET_VERIFICATION_STATUS, fetchVerificationStatus);
}

export default function* register() {
  yield fork(watchRegister);
  yield fork(watchCreateMetaTx);
  yield fork(watchGetVerificationStatus);
}
