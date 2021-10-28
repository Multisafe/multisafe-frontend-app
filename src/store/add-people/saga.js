import { call, put, fork, takeLatest } from "redux-saga/effects";
import { hide } from "redux-modal";

import { ADD_PEOPLE, ADD_BULK_PEOPLE } from "./action-types";
import {
  addPeopleSuccess,
  addPeopleError,
  addBulkPeopleSuccess,
  addBulkPeopleError,
} from "./actions";
import request from "utils/request";
import {
  createPeopleEndpoint,
  createBulkPeopleEndpoint,
} from "constants/endpoints";
import { MODAL_NAME as ADD_BULK_MODAL } from "components/People/AddBulkPeopleModal";
import { MODAL_NAME as ADD_SINGLE_MODAL } from "components/People/AddSinglePeopleModal";
import { getAllPeople } from "store/view-people/actions";
import { getTeams } from "store/view-teams/actions";

export function* createTeammate({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  tokenInfo,
}) {
  const requestURL = `${createPeopleEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      encryptedEmployeeDetails,
      safeAddress,
      createdBy,
      departmentId,
      departmentName,
      tokenInfo,
      joiningDate: Date.now(),
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addPeopleError(result.log));
    } else {
      yield put(addPeopleSuccess());
      yield put(hide(ADD_SINGLE_MODAL));
      yield put(getAllPeople(safeAddress));
      yield put(getTeams(safeAddress));
    }
  } catch (err) {
    yield put(addPeopleError(err.message));
  }
}

export function* createBulkTeammates({ safeAddress, createdBy, data }) {
  const requestURL = `${createBulkPeopleEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      safeAddress,
      createdBy,
      data,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addBulkPeopleError(result.log));
    } else {
      yield put(addBulkPeopleSuccess());
      yield put(hide(ADD_BULK_MODAL));
      yield put(getAllPeople(safeAddress));
      yield put(getTeams(safeAddress));
    }
  } catch (err) {
    yield put(addBulkPeopleError(err));
  }
}

function* watchAddPeople() {
  yield takeLatest(ADD_PEOPLE, createTeammate);
}

function* watchAddBulkPeople() {
  yield takeLatest(ADD_BULK_PEOPLE, createBulkTeammates);
}

export default function* addPeople() {
  yield fork(watchAddPeople);
  yield fork(watchAddBulkPeople);
}
