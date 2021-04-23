import { takeLatest, put, call, fork } from "redux-saga/effects";
import { hide } from "redux-modal";
import { ADD_TEAM } from "./action-types";
import { addTeamSuccess, addTeamError } from "./actions";
import request from "utils/request";
import { createDepartmentEndpoint } from "constants/endpoints";
import { MODAL_NAME as ADD_TEAM_MODAL } from "components/People/AddTeamModal";
import { getTeams } from "store/view-teams/actions";

function* addNewTeam({ name, safeAddress, createdBy, tokenInfo }) {
  const requestURL = `${createDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      name,
      safeAddress,
      createdBy,
      tokenInfo,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addTeamError(result.log));
    } else {
      yield put(addTeamSuccess(result.departmentId, result.log));
      yield put(hide(ADD_TEAM_MODAL));
      yield put(getTeams(safeAddress));
    }
  } catch (err) {
    yield put(addTeamError(err));
  }
}

function* watchAddTeam() {
  yield takeLatest(ADD_TEAM, addNewTeam);
}

export default function* team() {
  yield fork(watchAddTeam);
}
