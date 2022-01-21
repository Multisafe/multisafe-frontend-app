import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_OVERVIEW, GET_PORTFOLIO_HISTORY } from "./action-types";
import {
  getOverviewSuccess,
  getOverviewError,
  getPortfolioHistorySuccess,
  getPortfolioHistoryError,
} from "./actions";
import { request } from "utils/request";
import {
  getMoneyInOutEndpoint,
  portfolioHistoryEndpoint,
} from "constants/endpoints";

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

function* getPortfolioHistory(action) {
  const requestURL = `${portfolioHistoryEndpoint}?safeAddress=${action.safeAddress}`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getPortfolioHistorySuccess(result.data));
  } catch (err) {
    yield put(getPortfolioHistoryError(err));
  }
}

function* watchGetOverview() {
  yield takeLatest(GET_OVERVIEW, getMoneyInOut);
}

function* watchGetPortfolioHistory() {
  yield takeLatest(GET_PORTFOLIO_HISTORY, getPortfolioHistory);
}

export default function* overview() {
  yield fork(watchGetOverview);
  yield fork(watchGetPortfolioHistory);
}
