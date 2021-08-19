import { call, put, takeLatest } from "redux-saga/effects";
import { GET_TEAMS } from "./action-types";
import { getTeamsSuccess, getTeamsError } from "./actions";
import request from "utils/request";
import { getAllDepartmentsEndpoint } from "constants/endpoints";

export function* getTeams(action) {
  const requestURL = `${getAllDepartmentsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getTeamsSuccess([], 0, result.log));
    } else {
      yield put(
        getTeamsSuccess(result.departments, result.totalEmployees, result.log)
      );
    }
  } catch (err) {
    yield put(getTeamsError(err));
  }
}

export default function* viewTeams() {
  yield takeLatest(GET_TEAMS, getTeams);
}
