import {
  GET_METATX_ENABLED,
  GET_METATX_ENABLED_SUCCESS,
  GET_METATX_ENABLED_ERROR,
} from "./action-types";

export function getMetaTxEnabled(safeAddress) {
  return {
    type: GET_METATX_ENABLED,
    safeAddress,
  };
}

export function getMetaTxEnabledSuccess(isMetaTxEnabled, log) {
  return {
    type: GET_METATX_ENABLED_SUCCESS,
    isMetaTxEnabled,
    log,
  };
}

export function getMetaTxEnabledError(error) {
  return {
    type: GET_METATX_ENABLED_ERROR,
    error,
  };
}
