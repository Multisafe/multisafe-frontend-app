import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_SAFE_INFO } from "./action-types";
import { getSafeInfoSuccess, getSafeInfoError, setReadOnly } from "./actions";
import request from "utils/request";
import { getSafeInfoEndpoint } from "constants/endpoints";

function* fetchSafeInfo(action) {
  const requestURL = `${getSafeInfoEndpoint}?safeAddress=${action.safeAddress}&ownerAddress=${action.ownerAddress}`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getSafeInfoSuccess({ ...result }));
    yield put(setReadOnly(!result.isOwner));
  } catch (err) {
    yield put(getSafeInfoError(err));
  }
}

function* watchGetSafeInfo() {
  yield takeLatest(GET_SAFE_INFO, fetchSafeInfo);
}

export default function* global() {
  yield fork(watchGetSafeInfo);
}
