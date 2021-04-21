import {
  UPDATE_FORM,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_ERROR,
  EDIT_DEPARTMENT,
  EDIT_DEPARTMENT_SUCCESS,
  EDIT_DEPARTMENT_ERROR,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_ERROR,
} from "./action-types";

export function updateForm(formData) {
  return {
    type: UPDATE_FORM,
    formData,
  };
}

export function addDepartment({ name, safeAddress, createdBy }) {
  return {
    type: ADD_DEPARTMENT,
    name,
    safeAddress,
    createdBy,
  };
}

export function addDepartmentSuccess(departmentId, log) {
  return {
    type: ADD_DEPARTMENT_SUCCESS,
    departmentId,
    log,
  };
}

export function addDepartmentError(error) {
  return {
    type: ADD_DEPARTMENT_ERROR,
    error,
  };
}

export function editDepartment({ name, safeAddress, createdBy }) {
  return {
    type: EDIT_DEPARTMENT,
    name,
    safeAddress,
    createdBy,
  };
}

export function editDepartmentSuccess(departmentId, log) {
  return {
    type: EDIT_DEPARTMENT_SUCCESS,
    departmentId,
    log,
  };
}

export function editDepartmentError(error) {
  return {
    type: EDIT_DEPARTMENT_ERROR,
    error,
  };
}

export function deleteDepartment({ departmentId, safeAddress }) {
  return {
    type: DELETE_DEPARTMENT,
    departmentId,
    safeAddress,
  };
}

export function deleteDepartmentSuccess(departmentId, log) {
  return {
    type: DELETE_DEPARTMENT_SUCCESS,
    departmentId,
    log,
  };
}

export function deleteDepartmentError(error) {
  return {
    type: DELETE_DEPARTMENT_ERROR,
    error,
  };
}
