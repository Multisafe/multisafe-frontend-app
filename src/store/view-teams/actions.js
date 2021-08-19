import { GET_TEAMS, GET_TEAMS_SUCCESS, GET_TEAMS_ERROR } from "./action-types";

export function getTeams(safeAddress) {
  return {
    type: GET_TEAMS,
    safeAddress,
  };
}

export function getTeamsSuccess(teams, teammatesCount, log) {
  return {
    type: GET_TEAMS_SUCCESS,
    teams,
    teammatesCount,
    log,
  };
}

export function getTeamsError(error) {
  return {
    type: GET_TEAMS_ERROR,
    error,
  };
}
