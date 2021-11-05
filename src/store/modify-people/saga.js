import { call, put, fork, takeLatest } from "redux-saga/effects";
import { hide } from "redux-modal";

import { EDIT_PEOPLE, DELETE_PEOPLE } from "./action-types";
import {
  editPeopleError,
  editPeopleSuccess,
  deletePeopleSuccess,
  deletePeopleError,
} from "./actions";
import request from "utils/request";
import { editPeopleEndpoint, deletePeopleEndpoint } from "constants/endpoints";
import { getAllPeople } from "store/view-people/actions";
import { MODAL_NAME as DELETE_PEOPLE_MODAL } from "components/People/DeletePeopleModal";
import { MODAL_NAME as EDIT_PEOPLE_MODAL } from "components/People/AddSinglePeopleModal";
import { togglePeopleDetails } from "store/layout/actions";
import { getTeams } from "store/view-teams/actions";

export function* editPeople({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  peopleId,
}) {
  const requestURL = `${editPeopleEndpoint}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      encryptedEmployeeDetails,
      safeAddress,
      createdBy,
      departmentId,
      departmentName,
      peopleId,
      joiningDate: Date.now(),
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(editPeopleError(result.log));
    } else {
      yield put(editPeopleSuccess(result.log));
      yield put(hide(EDIT_PEOPLE_MODAL));
      yield put(togglePeopleDetails(false));
      yield put(getAllPeople(safeAddress));
    }
  } catch (err) {
    yield put(editPeopleError(err));
  }
}
export function* deletePeople({ peopleId, safeAddress, departmentId }) {
  const requestURL = `${deletePeopleEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      peopleId,
      safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(deletePeopleError(result.log));
    } else {
      yield put(deletePeopleSuccess(result.log));
      yield put(hide(DELETE_PEOPLE_MODAL));
      yield put(togglePeopleDetails(false));
      yield put(getAllPeople(safeAddress));
      yield put(getTeams(safeAddress));
    }
  } catch (err) {
    yield put(deletePeopleError(err));
  }
}

function* watchEditPeople() {
  yield takeLatest(EDIT_PEOPLE, editPeople);
}

function* watchDeletePeople() {
  yield takeLatest(DELETE_PEOPLE, deletePeople);
}

export default function* modifyPeople() {
  yield fork(watchEditPeople);
  yield fork(watchDeletePeople);
}
