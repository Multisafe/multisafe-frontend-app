import { call, fork, put, takeLatest } from "redux-saga/effects";

import { MODIFY_ORGANISATION_NAME } from "./action-types";
import {
  modifyOrganisationNameSuccess,
  modifyOrganisationNameError,
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

function* watchModifyOrganisationName() {
  yield takeLatest(MODIFY_ORGANISATION_NAME, updateOrganisationName);
}

export default function* organisation() {
  yield fork(watchModifyOrganisationName);
}
