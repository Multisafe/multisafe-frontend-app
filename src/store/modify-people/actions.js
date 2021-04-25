import {
  EDIT_PEOPLE,
  EDIT_PEOPLE_SUCCESS,
  EDIT_PEOPLE_ERROR,
  DELETE_PEOPLE,
  DELETE_PEOPLE_SUCCESS,
  DELETE_PEOPLE_ERROR,
} from "./action-types";

export function editPeople({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  peopleId,
}) {
  return {
    type: EDIT_PEOPLE,
    encryptedEmployeeDetails,
    safeAddress,
    createdBy,
    departmentId,
    departmentName,
    peopleId,
  };
}

export function editPeopleSuccess(log) {
  return {
    type: EDIT_PEOPLE_SUCCESS,
    log,
  };
}

export function editPeopleError(error) {
  return {
    type: EDIT_PEOPLE_ERROR,
    error,
  };
}

export function deletePeople(safeAddress, peopleId) {
  return {
    type: DELETE_PEOPLE,
    safeAddress,
    peopleId,
  };
}

export function deletePeopleSuccess(log) {
  return {
    type: DELETE_PEOPLE_SUCCESS,
    log,
  };
}

export function deletePeopleError(error) {
  return {
    type: DELETE_PEOPLE_ERROR,
    error,
  };
}
