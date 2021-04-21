import { takeLatest, put, call, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import { ADD_DEPARTMENT, DELETE_DEPARTMENT } from "./action-types";
import {
  addDepartmentSuccess,
  addDepartmentError,
  deleteDepartmentError,
  deleteDepartmentSuccess,
} from "./actions";
import request from "utils/request";
import {
  createDepartmentEndpoint,
  deleteDepartmentEndpoint,
} from "constants/endpoints";

function* addDepartment(action) {
  const requestURL = `${createDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      name: action.name,
      safeAddress: action.safeAddress,
      createdBy: action.createdBy,
    }),
    // headers: {
    //   "content-type": "application/json",
    // },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addDepartmentError(result.log));
    } else {
      yield put(addDepartmentSuccess(result.departmentId, result.log));
    }
  } catch (err) {
    yield put(addDepartmentError(err));
  }
}

function* deleteDepartment(action) {
  const requestURL = `${deleteDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      departmentId: action.departmentId,
      safeAddress: action.safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(deleteDepartmentError(result.log));
    } else {
      yield put(deleteDepartmentSuccess(result.departmentId, result.log));
      yield put(push("/dashboard/people"));
    }
  } catch (err) {
    yield put(deleteDepartmentError(err));
  }
}

function* watchAddDepartment() {
  yield takeLatest(ADD_DEPARTMENT, addDepartment);
}

function* watchDeleteDepartment() {
  yield takeLatest(DELETE_DEPARTMENT, deleteDepartment);
}

export default function* departments() {
  yield fork(watchAddDepartment);
  yield fork(watchDeleteDepartment);
}
