import { call, put, fork, takeLatest } from "redux-saga/effects";
import { ethers } from "ethers";

import { GET_SAFE_INFO } from "./action-types";
import { getSafeInfoSuccess, getSafeInfoError } from "./actions";
import { request } from "utils/request";
import { getSafeInfoEndpoint } from "constants/endpoints";
import { logoutUser } from "store/logout/actions";

function* fetchSafeInfo({ safeAddress, ownerAddress, isCached }) {
  if (!ethers.utils.isAddress(safeAddress)) yield put(logoutUser());

  const requestURL = new URL(`${getSafeInfoEndpoint}`);
  const params = [
    ["safeAddress", safeAddress],
    ["ownerAddress", ownerAddress],
    ["isCached", isCached],
  ];
  requestURL.search = new URLSearchParams(params).toString();
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);

    if (result.flag === 145) {
      yield put(getSafeInfoError(result.log));
      yield put(logoutUser());
    } else {
      yield put(getSafeInfoSuccess({ ...result }));
    }
  } catch (err) {
    yield put(getSafeInfoError(err.message));
  }
}

function* watchGetSafeInfo() {
  yield takeLatest(GET_SAFE_INFO, fetchSafeInfo);
}

export default function* global() {
  yield fork(watchGetSafeInfo);
}
