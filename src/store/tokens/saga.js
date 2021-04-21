import { takeLatest, put, call, fork } from "redux-saga/effects";
import { GET_TOKENS, ADD_CUSTOM_TOKEN } from "./action-types";
import {
  getTokens,
  getTokensSuccess,
  getTokensError,
  addCustomTokenSuccess,
  addCustomTokenError,
} from "./actions";
import request from "utils/request";
import { getTokensEndpoint, addCustomTokenEndpoint } from "constants/endpoints";

function* addCustomToken(action) {
  const requestURL = `${addCustomTokenEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      safeAddress: action.safeAddress,
      contractAddress: action.contractAddress,
    }),
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addCustomTokenError(result.log));
    } else {
      yield put(addCustomTokenSuccess(result.log));
      yield put(getTokens(action.safeAddress));
    }
  } catch (err) {
    yield put(addCustomTokenError(err));
  }
}

function* fetchTokens(action) {
  const requestURL = `${getTokensEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getTokensError(result.log));
    } else {
      yield put(
        getTokensSuccess(result.tokens, result.prices, result.icons, result.log)
      );
    }
  } catch (err) {
    yield put(getTokensError(err.message));
  }
}

function* watchGetTokens() {
  yield takeLatest(GET_TOKENS, fetchTokens);
}

function* watchAddCustomToken() {
  yield takeLatest(ADD_CUSTOM_TOKEN, addCustomToken);
}

export default function* tokens() {
  yield fork(watchGetTokens);
  yield fork(watchAddCustomToken);
}
