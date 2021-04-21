import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_NONCE } from "./action-types";
import { getNonceSuccess, getNonceError } from "./actions";
import request from "utils/request";
import { gnosisSafeTransactionEndpoint } from "constants/endpoints";

function* getTransactionNonce(action) {
  const requestURL = `${gnosisSafeTransactionEndpoint}${action.safeAddress}/transactions/?has_confirmations=True`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getNonceSuccess(result.count, result.countUniqueNonce));
  } catch (err) {
    yield put(getNonceError(err));
  }
}

function* watchGetNonce() {
  yield takeLatest(GET_NONCE, getTransactionNonce);
}

export default function* safe() {
  yield fork(watchGetNonce);
}
