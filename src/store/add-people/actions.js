import {
  UPDATE_FORM,
  ADD_PEOPLE,
  ADD_PEOPLE_SUCCESS,
  ADD_PEOPLE_ERROR,
  ADD_BULK_PEOPLE,
  ADD_BULK_PEOPLE_SUCCESS,
  ADD_BULK_PEOPLE_ERROR,
} from "./action-types";

export function updateForm(formData) {
  return {
    type: UPDATE_FORM,
    formData,
  };
}

export function addPeople({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  joiningDate,
}) {
  return {
    type: ADD_PEOPLE,
    body: {
      encryptedEmployeeDetails,
      safeAddress,
      createdBy,
      departmentId,
      departmentName,
      joiningDate,
    },
  };
}

export function addPeopleSuccess() {
  return {
    type: ADD_PEOPLE_SUCCESS,
  };
}

export function addPeopleError(error) {
  return {
    type: ADD_PEOPLE_ERROR,
    error,
  };
}

export function addBulkPeople({ safeAddress, createdBy, data }) {
  return {
    type: ADD_BULK_PEOPLE,
    createdBy,
    safeAddress,
    data,
  };
}

export function addBulkPeopleSuccess() {
  return {
    type: ADD_BULK_PEOPLE_SUCCESS,
  };
}

export function addBulkPeopleError(error) {
  return {
    type: ADD_BULK_PEOPLE_ERROR,
    error,
  };
}
