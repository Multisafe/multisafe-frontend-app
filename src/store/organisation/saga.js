import { call, fork, put, takeLatest } from "redux-saga/effects";

import { GET_DATA_SHARING, MODIFY_ORGANISATION_NAME } from "./action-types";
import {
  modifyOrganisationNameSuccess,
  modifyOrganisationNameError,
  getDataSharingSuccess,
  getDataSharingError,
  toggleDataSharingSuccess,
  toggleDataSharingError,
} from "./actions";
import request from "utils/request";
import { updateOrganisationNameEndpoint } from "constants/endpoints";
import { setOwnerName } from "store/global/actions";

export function* updateOrganisationName({ organisationName, safeAddress }) {
  const requestURL = `${updateOrganisationNameEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      name: organisationName,
      safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(modifyOrganisationNameError(result.log));
    } else {
      yield put(modifyOrganisationNameSuccess(result.name, result.log));
      yield put(setOwnerName(organisationName));
    }
  } catch (err) {
    yield put(modifyOrganisationNameError(err.message));
  }
}

export function* toggleDataSharing({ isEnabled, safeAddress }) {
  const requestURL = `${updateOrganisationNameEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      isEnabled,
      safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(toggleDataSharingError(result.log));
    } else {
      yield put(toggleDataSharingSuccess(result.log));
    }
  } catch (err) {
    yield put(toggleDataSharingError(err.message));
  }
}

export function* fetchDataSharing({ safeAddress }) {
  const requestURL = new URL(updateOrganisationNameEndpoint);
  const params = [["safeAddress", safeAddress]];
  requestURL.search = new URLSearchParams(params).toString();

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getDataSharingError(result.log));
    } else {
      yield put(getDataSharingSuccess(result.isEnabled, result.log));
    }
  } catch (err) {
    yield put(getDataSharingError(err.message));
  }
}

function* watchModifyOrganisationName() {
  yield takeLatest(MODIFY_ORGANISATION_NAME, updateOrganisationName);
}

function* watchGetDataSharing() {
  yield takeLatest(GET_DATA_SHARING, fetchDataSharing);
}

function* watchToggleDataSharing() {
  yield takeLatest(GET_DATA_SHARING, toggleDataSharing);
}

export default function* organisation() {
  yield fork(watchModifyOrganisationName);
  yield fork(watchGetDataSharing);
  yield fork(watchToggleDataSharing);
}
