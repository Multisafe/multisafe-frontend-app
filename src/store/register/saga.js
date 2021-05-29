import { call, put, fork, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";

import { CREATE_META_TX, REGISTER_USER } from "./action-types";
import {
  registerUserSuccess,
  registerUserError,
  createMetaTxError,
  createMetaTxSuccess,
} from "./actions";
import request from "utils/request";
// import { makeSelectUsername } from "containers/HomePage/selectors";
import { registerEndpoint, createMetaTxEndpoint } from "constants/endpoints";
import { networkId } from "constants/networks";
import { routeGenerators } from "constants/routes/generators";

export function* registerUser(action) {
  const requestURL = registerEndpoint;
  const options = {
    method: "POST",
    body: JSON.stringify({ ...action.body, networkId }),
    headers: {
      "content-type": "application/json",
    },
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
      if (action.redirect)
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
    body: JSON.stringify({ ...action.body, networkId }),
    headers: {
      "content-type": "application/json",
    },
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

function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerUser);
}

function* watchCreateMetaTx() {
  yield takeLatest(CREATE_META_TX, createMetaTx);
}

export default function* register() {
  yield fork(watchRegister);
  yield fork(watchCreateMetaTx);
}
