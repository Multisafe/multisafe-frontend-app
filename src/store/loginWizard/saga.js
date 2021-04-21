/**
 * loginWizard Saga
 */

import { call, put, fork, takeLatest } from "redux-saga/effects";
import {
  GET_SAFES,
  FETCH_SAFES,
  GET_PARCEL_SAFES,
  GET_SAFE_OWNERS,
} from "./action-types";
import {
  getSafesSuccess,
  getSafesError,
  getSafeOwnersSuccess,
  getSafeOwnersError,
} from "./actions";
import request from "utils/request";
import {
  getSafesEndpoint,
  fetchSafesEndpoint,
  getParcelSafesEndpoint,
  getSafeOwnersEndpoint,
} from "constants/endpoints";
import { networkId } from "constants/networks";

export function* getSafes(action) {
  const requestURL = `${getSafesEndpoint}?owner=${action.owner}&status=${action.status}&networkId=${networkId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafesError(result.log));
    } else {
      yield put(getSafesSuccess(result.safes, result.owner, result.log));
    }
  } catch (err) {
    yield put(getSafesError(err));
  }
}

export function* getParcelSafes(action) {
  const requestURL = `${getParcelSafesEndpoint}?owner=${action.owner}&status=${action.status}&networkId=${networkId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafesError(result.log));
    } else {
      yield put(getSafesSuccess(result.safes, result.owner, result.log));
    }
  } catch (err) {
    yield put(getSafesError(err));
  }
}

export function* fetchSafes(action) {
  const requestURL = `${fetchSafesEndpoint}?owner=${action.owner}&networkId=${networkId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafesError(result.log));
    } else {
      // Fetch safes api will asynchronously call get safes
      // so that by the time the user reaches the select safe section
      // the safes are ready
      yield put(getSafesSuccess([], "", result.log));
    }
  } catch (err) {
    yield put(getSafesError(err));
  }
}

export function* getSafeOwners(action) {
  const requestURL = `${getSafeOwnersEndpoint}?safeAddress=${action.owner}&networkId=${networkId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafeOwnersError(result.log));
    } else {
      yield put(
        getSafeOwnersSuccess(result.owners, result.threshold, result.log)
      );
    }
  } catch (err) {
    yield put(getSafeOwnersError(err));
  }
}

function* watchGetSafes() {
  yield takeLatest(GET_SAFES, getSafes);
}

function* watchFetchSafes() {
  yield takeLatest(FETCH_SAFES, fetchSafes);
}

function* watchGetParcelSafes() {
  yield takeLatest(GET_PARCEL_SAFES, getParcelSafes);
}

function* watchGetSafeOwners() {
  yield takeLatest(GET_SAFE_OWNERS, getSafeOwners);
}

export default function* safes() {
  yield fork(watchGetSafes);
  yield fork(watchFetchSafes);
  yield fork(watchGetParcelSafes);
  yield fork(watchGetSafeOwners);
}
