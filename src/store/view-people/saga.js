import { takeLatest, put, fork, call } from "redux-saga/effects";
import { GET_ALL_PEOPLE, GET_PEOPLE_BY_DEPARTMENT } from "./action-types";
import {
  getAllPeopleSuccess,
  getAllPeopleError,
  getPeopleByDepartmentSuccess,
  getPeopleByDepartmentError,
} from "./actions";
import request from "utils/request";
import {
  getAllPeopleEndpoint,
  getPeopleByDepartmentIdEndpoint,
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
      yield put(getPeopleByDepartmentSuccess([]));
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
  const requestURL = `${getPeopleByDepartmentIdEndpoint}?safeAddress=${action.safeAddress}&departmentId=${action.departmentId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 400) {
      yield put(getPeopleByDepartmentSuccess([], result.departmentName));
    } else if (result.flag !== 200) {
      yield put(getPeopleByDepartmentError(result.log));
    } else {
      yield put(
        getPeopleByDepartmentSuccess(result.employees, result.departmentName)
      );
    }
  } catch (err) {
    yield put(getPeopleByDepartmentError(err));
  }
}

function* watchGetAllPeople() {
  yield takeLatest(GET_ALL_PEOPLE, fetchAllTeammates);
}

function* watchGetPeopleByDepartmentId() {
  yield takeLatest(GET_PEOPLE_BY_DEPARTMENT, fetchTeammatesByDepartmentId);
}

export default function* viewPeople() {
  yield fork(watchGetAllPeople);
  yield fork(watchGetPeopleByDepartmentId);
}
