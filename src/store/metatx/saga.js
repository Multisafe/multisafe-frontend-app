import { call, put, takeLatest } from "redux-saga/effects";
import { GET_METATX_ENABLED } from "./action-types";
import { getMetaTxEnabledSuccess, getMetaTxEnabledError } from "./actions";
import request from "utils/request";
import { getMetaTxLimitsEndpoint } from "constants/endpoints";

export function* getMetaTxEnabled(action) {
  const requestURL = `${getMetaTxLimitsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getMetaTxEnabledError(result.log));
    } else {
      yield put(
        getMetaTxEnabledSuccess(
          result.limits && result.limits.allowed,
          result.log
        )
      );
    }
  } catch (err) {
    yield put(getMetaTxEnabledError(err));
  }
}

export default function* watchgetMetaTxEnabled() {
  yield takeLatest(GET_METATX_ENABLED, getMetaTxEnabled);
}
