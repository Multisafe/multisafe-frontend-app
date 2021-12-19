import {
  GET_ADMIN_STATS,
  GET_ADMIN_STATS_SUCCESS,
  GET_ADMIN_STATS_ERROR,
  GET_ALL_SAFE_ACTIVITY,
  GET_ALL_SAFE_ACTIVITY_SUCCESS,
  GET_ALL_SAFE_ACTIVITY_ERROR,
  GET_CURRENT_SAFE_ACTIVITY,
  GET_CURRENT_SAFE_ACTIVITY_SUCCESS,
  GET_CURRENT_SAFE_ACTIVITY_ERROR,
  RESET_CURRENT_SAFE_ACTIVITY,
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

export function getAllSafeActivity({ to, from }) {
  return {
    type: GET_ALL_SAFE_ACTIVITY,
    to,
    from,
  };
}

export function getAllSafeActivitySuccess(allSafeActivity) {
  return {
    type: GET_ALL_SAFE_ACTIVITY_SUCCESS,
    allSafeActivity,
  };
}

export function getAllSafeActivityError(error) {
  return {
    type: GET_ALL_SAFE_ACTIVITY_ERROR,
    error,
  };
}

export function getCurrentSafeActivity({ to, from, safeAddress }) {
  return {
    type: GET_CURRENT_SAFE_ACTIVITY,
    to,
    from,
    safeAddress,
  };
}

export function getCurrentSafeActivitySuccess(currentSafeActivity) {
  return {
    type: GET_CURRENT_SAFE_ACTIVITY_SUCCESS,
    currentSafeActivity,
  };
}

export function getCurrentSafeActivityError(error) {
  return {
    type: GET_CURRENT_SAFE_ACTIVITY_ERROR,
    error,
  };
}
export function resetCurrentSafeActivity() {
  return {
    type: RESET_CURRENT_SAFE_ACTIVITY,
  };
}
