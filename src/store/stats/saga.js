import { call, put, fork, takeLatest } from "redux-saga/effects";
import {
  GET_ADMIN_STATS,
  GET_ALL_SAFE_ACTIVITY,
  GET_CURRENT_SAFE_ACTIVITY,
} from "./action-types";
import {
  getAdminStatsSuccess,
  getAdminStatsError,
  getAllSafeActivitySuccess,
  getAllSafeActivityError,
  getCurrentSafeActivitySuccess,
  getCurrentSafeActivityError,
} from "./actions";
import request from "utils/request";
import {
  getAdminStatsEndpoint,
  getSafeActivityEndpoint,
} from "constants/endpoints";
import { networkId } from "constants/networks";

function* fetchAdminStats() {
  const requestURL = `${getAdminStatsEndpoint}?networkId=${networkId}`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getAdminStatsSuccess(result));
  } catch (err) {
    yield put(getAdminStatsError(err));
  }
}

function* fetchAllSafeActivity({ to, from }) {
  const requestURL = new URL(getSafeActivityEndpoint);

  const params = [
    ["networkId", networkId],
    ["to", to],
    ["from", from],
  ];
  requestURL.search = new URLSearchParams(params).toString();

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getAllSafeActivitySuccess(result));
  } catch (err) {
    yield put(getAllSafeActivityError(err));
  }
}

function* fetchCurrentSafeActivity({ to, from, safeAddress }) {
  const requestURL = new URL(getSafeActivityEndpoint);

  const params = [
    ["networkId", networkId],
    ["to", to],
    ["from", from],
    ["safeAddress", safeAddress],
  ];
  requestURL.search = new URLSearchParams(params).toString();

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getCurrentSafeActivitySuccess(result));
  } catch (err) {
    yield put(getCurrentSafeActivityError(err));
  }
}

function* watchGetAdminStats() {
  yield takeLatest(GET_ADMIN_STATS, fetchAdminStats);
}

function* watchGetAllSafeActivity() {
  yield takeLatest(GET_ALL_SAFE_ACTIVITY, fetchAllSafeActivity);
}

function* watchGetCurrentSafeActivity() {
  yield takeLatest(GET_CURRENT_SAFE_ACTIVITY, fetchCurrentSafeActivity);
}

export default function* stats() {
  yield fork(watchGetAdminStats);
  yield fork(watchGetAllSafeActivity);
  yield fork(watchGetCurrentSafeActivity);
}
