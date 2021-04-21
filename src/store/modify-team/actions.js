import {
  EDIT_TEAM,
  EDIT_TEAM_SUCCESS,
  EDIT_TEAM_ERROR,
  DELETE_TEAM,
  DELETE_TEAM_SUCCESS,
  DELETE_TEAM_ERROR,
} from "./action-types";

export function editTeam({ name, safeAddress, createdBy }) {
  return {
    type: EDIT_TEAM,
    name,
    safeAddress,
    createdBy,
  };
}

export function editTeamSuccess(departmentId, log) {
  return {
    type: EDIT_TEAM_SUCCESS,
    departmentId,
    log,
  };
}

export function editTeamError(error) {
  return {
    type: EDIT_TEAM_ERROR,
    error,
  };
}

export function deleteTeam({ departmentId, safeAddress }) {
  return {
    type: DELETE_TEAM,
    departmentId,
    safeAddress,
  };
}

export function deleteTeamSuccess(departmentId, log) {
  return {
    type: DELETE_TEAM_SUCCESS,
    departmentId,
    log,
  };
}

export function deleteTeamError(error) {
  return {
    type: DELETE_TEAM_ERROR,
    error,
  };
}
