/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { GET_SAFES } from "./action-types";
import { getSafesSuccess, getSafesError } from "./actions";
import request from "utils/request";
// import { makeSelectUsername } from "containers/HomePage/selectors";
import { getSafesEndpoint } from "constants/endpoints";

export function* getSafes(action) {
  // Select username from store
  // const username = yield select(makeSelectUsername());
  const requestURL = `${getSafesEndpoint}?owner=${action.owner}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafesError(result.log));
    } else {
      yield put(getSafesSuccess(result.safes, result.log));
    }
  } catch (err) {
    yield put(getSafesError(err));
  }
}

export default function* watchGetSafes() {
  yield takeLatest(GET_SAFES, getSafes);
}
