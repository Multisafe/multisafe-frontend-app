import { call, fork, put, takeLatest } from "redux-saga/effects";
import { hide } from "redux-modal";

import { MODIFY_ORGANISATION_NAME, TOGGLE_DATA_SHARING } from "./action-types";
import {
  modifyOrganisationNameSuccess,
  modifyOrganisationNameError,
  toggleDataSharingSuccess,
  toggleDataSharingError,
} from "./actions";
import {request} from "utils/request";
import {
  updateOrganisationNameEndpoint,
  organisationPermissionsEndpoint,
} from "constants/endpoints";
import { setDataSharingAllowed, setOwnerName } from "store/global/actions";
import { MODAL_NAME as DATA_SHARING_MODAL } from "components/Profile/DataSharingModal";

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

export function* toggleDataSharing({ isDataSharingAllowed, safeAddress }) {
  const requestURL = `${organisationPermissionsEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      sharingEnabled: isDataSharingAllowed,
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
      yield put(hide(DATA_SHARING_MODAL));
      yield put(setDataSharingAllowed(isDataSharingAllowed));
    }
  } catch (err) {
    yield put(toggleDataSharingError(err.message));
  }
}

function* watchModifyOrganisationName() {
  yield takeLatest(MODIFY_ORGANISATION_NAME, updateOrganisationName);
}

function* watchToggleDataSharing() {
  yield takeLatest(TOGGLE_DATA_SHARING, toggleDataSharing);
}

export default function* organisation() {
  yield fork(watchModifyOrganisationName);
  yield fork(watchToggleDataSharing);
}
