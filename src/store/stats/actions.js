import {
  GET_ADMIN_STATS,
  GET_ADMIN_STATS_SUCCESS,
  GET_ADMIN_STATS_ERROR,
} from "./action-types";

export function getAdminStats() {
  return {
    type: GET_ADMIN_STATS,
  };
}

export function getAdminStatsSuccess(stats) {
  return {
    type: GET_ADMIN_STATS_SUCCESS,
    stats,
  };
}

export function getAdminStatsError(error) {
  return {
    type: GET_ADMIN_STATS_ERROR,
    error,
  };
}
