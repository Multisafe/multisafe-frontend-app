import { ADD_TEAM, ADD_TEAM_SUCCESS, ADD_TEAM_ERROR } from "./action-types";

export function addTeam({ name, safeAddress, createdBy, tokenInfo }) {
  return {
    type: ADD_TEAM,
    name,
    safeAddress,
    createdBy,
    tokenInfo,
  };
}

export function addTeamSuccess(departmentId, log) {
  return {
    type: ADD_TEAM_SUCCESS,
    departmentId,
    log,
  };
}

export function addTeamError(error) {
  return {
    type: ADD_TEAM_ERROR,
    error,
  };
}
