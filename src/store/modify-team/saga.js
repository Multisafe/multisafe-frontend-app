import { takeLatest, put, call, fork } from "redux-saga/effects";
import { hide } from "redux-modal";

import { DELETE_TEAM, EDIT_TEAM } from "./action-types";
import {
  deleteTeamError,
  deleteTeamSuccess,
  editTeamError,
  editTeamSuccess,
} from "./actions";
import request from "utils/request";
import {
  deleteDepartmentEndpoint,
  updateDepartmentEndpoint,
} from "constants/endpoints";
import { MODAL_NAME as DELETE_TEAM_MODAL } from "components/People/DeleteTeamModal";
import { MODAL_NAME as EDIT_TEAM_MODAL } from "components/People/AddTeamModal";
import { getAllPeople, removePeopleFilter } from "store/view-people/actions";
import { PEOPLE_FILTERS } from "store/view-people/constants";
import { getTeams } from "store/view-teams/actions";

function* editDepartment({
  name,
  safeAddress,
  tokenInfo,
  departmentId,
  peopleDetails,
}) {
  const requestURL = `${updateDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      departmentId,
      safeAddress,
      tokenInfo,
      name,
      peopleDetails,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(editTeamError(result.log));
    } else {
      yield put(editTeamSuccess(result.departmentId, result.log));
      yield put(hide(EDIT_TEAM_MODAL));
      yield put(getAllPeople(safeAddress));
      yield put(getTeams(safeAddress));
    }
  } catch (err) {
    yield put(editTeamError(err.message));
  }
}

function* deleteDepartment({ departmentId, safeAddress }) {
  const requestURL = `${deleteDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      departmentId,
      safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(deleteTeamError(result.log));
    } else {
      yield put(deleteTeamSuccess(result.departmentId, result.log));
      yield put(hide(DELETE_TEAM_MODAL));
      yield put(removePeopleFilter(PEOPLE_FILTERS.TEAM));
      yield put(removePeopleFilter(PEOPLE_FILTERS.NAME));
      yield put(getAllPeople(safeAddress));
      yield put(getTeams(safeAddress));
    }
  } catch (err) {
    yield put(deleteTeamError(err));
  }
}

function* watchDeleteTeam() {
  yield takeLatest(DELETE_TEAM, deleteDepartment);
}

function* watchEditTeam() {
  yield takeLatest(EDIT_TEAM, editDepartment);
}

export default function* modifyTeam() {
  yield fork(watchEditTeam);
  yield fork(watchDeleteTeam);
}
