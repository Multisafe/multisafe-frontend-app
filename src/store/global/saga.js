import { call, put, fork, takeLatest } from "redux-saga/effects";
import { isAddress } from "@ethersproject/address";

import { GET_SAFE_INFO } from "./action-types";
import { getSafeInfoSuccess, getSafeInfoError } from "./actions";
import request from "utils/request";
import { getSafeInfoEndpoint } from "constants/endpoints";
import { logoutUser } from "store/logout/actions";

function* fetchSafeInfo(action) {
  if (!isAddress(action.safeAddress)) yield put(logoutUser());

  const requestURL = `${getSafeInfoEndpoint}?safeAddress=${action.safeAddress}&ownerAddress=${action.ownerAddress}`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getSafeInfoSuccess({ ...result }));
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
