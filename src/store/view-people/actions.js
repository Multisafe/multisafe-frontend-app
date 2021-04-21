import {
  GET_ALL_PEOPLE,
  GET_ALL_PEOPLE_SUCCESS,
  GET_ALL_PEOPLE_ERROR,
  GET_PEOPLE_BY_DEPARTMENT,
  GET_PEOPLE_BY_DEPARTMENT_SUCCESS,
  GET_PEOPLE_BY_DEPARTMENT_ERROR,
  ADD_PEOPLE_FILTER,
  REMOVE_PEOPLE_FILTER,
  SET_SEARCH_NAME,
} from "./action-types";

export function getAllPeople(safeAddress) {
  return {
    type: GET_ALL_PEOPLE,
    safeAddress,
  };
}

export function getAllPeopleSuccess(people) {
  return {
    type: GET_ALL_PEOPLE_SUCCESS,
    people,
  };
}

export function getAllPeopleError(error) {
  return {
    type: GET_ALL_PEOPLE_ERROR,
    error,
  };
}

export function getPeopleByDepartment(safeAddress, departmentId) {
  return {
    type: GET_PEOPLE_BY_DEPARTMENT,
    safeAddress,
    departmentId,
  };
}

export function getPeopleByDepartmentSuccess(teammates, departmentName) {
  return {
    type: GET_PEOPLE_BY_DEPARTMENT_SUCCESS,
    teammates,
    departmentName,
  };
}

export function getPeopleByDepartmentError(error) {
  return {
    type: GET_PEOPLE_BY_DEPARTMENT_ERROR,
    error,
  };
}

export function addPeopleFilter(filter, value) {
  return {
    type: ADD_PEOPLE_FILTER,
    filter,
    value,
  };
}

export function removePeopleFilter(filter) {
  return {
    type: REMOVE_PEOPLE_FILTER,
    filter,
  };
}
export function setSearchName(name) {
  return {
    type: SET_SEARCH_NAME,
    name,
  };
}
