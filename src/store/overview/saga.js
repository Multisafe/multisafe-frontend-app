import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_OVERVIEW } from "./action-types";
import { getOverviewSuccess, getOverviewError } from "./actions";
import request from "utils/request";
import { getMoneyInOutEndpoint } from "constants/endpoints";

function* getMoneyInOut(action) {
  const requestURL = `${getMoneyInOutEndpoint}?safeAddress=${action.safeAddress}`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getOverviewSuccess(result.moneyIn, result.moneyOut));
  } catch (err) {
    yield put(getOverviewError(err));
  }
}

function* watchGetOverview() {
  yield takeLatest(GET_OVERVIEW, getMoneyInOut);
}

export default function* overview() {
  yield fork(watchGetOverview);
}
