import { takeLatest, put, call, fork } from "redux-saga/effects";
import { hide } from "redux-modal";

import { DELETE_TEAM } from "./action-types";
import { deleteTeamError, deleteTeamSuccess } from "./actions";
import request from "utils/request";
import { deleteDepartmentEndpoint } from "constants/endpoints";
import { MODAL_NAME as DELETE_TEAM_MODAL } from "components/People/DeleteTeamModal";
import { getAllPeople, removePeopleFilter } from "store/view-people/actions";
import { PEOPLE_FILTERS } from "store/view-people/constants";
import { getTeams } from "store/view-teams/actions";

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

function* watchDeleteDepartment() {
  yield takeLatest(DELETE_TEAM, deleteDepartment);
}

export default function* modifyTeam() {
  yield fork(watchDeleteDepartment);
}
