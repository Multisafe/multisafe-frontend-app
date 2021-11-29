import { takeLatest, put, fork, call } from "redux-saga/effects";
import { GET_ALL_PEOPLE, GET_PEOPLE_BY_TEAM } from "./action-types";
import {
  getAllPeopleSuccess,
  getAllPeopleError,
  getPeopleByTeamSuccess,
  getPeopleByTeamError,
} from "./actions";
import request from "utils/request";
import {
  getAllPeopleEndpoint,
  getPeopleByTeamIdEndpoint,
} from "constants/endpoints";

function* fetchAllTeammates(action) {
  const requestURL = `${getAllPeopleEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 400) {
      // no teammates
      yield put(getAllPeopleSuccess([]));
    } else if (result.flag !== 200) {
      yield put(getAllPeopleError(result.log));
    } else {
      yield put(getAllPeopleSuccess(result.employees));
    }
  } catch (err) {
    yield put(getAllPeopleError(err));
  }
}

function* fetchTeammatesByDepartmentId(action) {
  const requestURL = `${getPeopleByTeamIdEndpoint}?safeAddress=${action.safeAddress}&departmentId=${action.departmentId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 400) {
      yield put(getPeopleByTeamSuccess([], result.departmentName));
    } else if (result.flag !== 200) {
      yield put(getPeopleByTeamError(result.log));
    } else {
      yield put(
        getPeopleByTeamSuccess(result.employees, result.departmentName)
      );
    }
  } catch (err) {
    yield put(getPeopleByTeamError(err));
  }
}

function* watchGetAllPeople() {
  yield takeLatest(GET_ALL_PEOPLE, fetchAllTeammates);
}

function* watchGetPeopleByTeamId() {
  yield takeLatest(GET_PEOPLE_BY_TEAM, fetchTeammatesByDepartmentId);
}

export default function* viewPeople() {
  yield fork(watchGetAllPeople);
  yield fork(watchGetPeopleByTeamId);
}
