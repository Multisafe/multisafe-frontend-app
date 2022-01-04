import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_ADMIN_STATS } from "./action-types";
import { getAdminStatsSuccess, getAdminStatsError } from "./actions";
import request from "utils/request";
import { getAdminStatsEndpoint } from "constants/endpoints";

function* fetchAdminStats(action) {
  const requestURL = `${getAdminStatsEndpoint}`;

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

function* watchGetAdminStats() {
  yield takeLatest(GET_ADMIN_STATS, fetchAdminStats);
}

export default function* stats() {
  yield fork(watchGetAdminStats);
}
