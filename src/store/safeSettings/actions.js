import {
  GET_SAFE_SETTINGS,
  GET_SAFE_SETTINGS_SUCCESS,
  GET_SAFE_SETTINGS_ERROR,
  SET_SAFE_SETTINGS,
} from "./action-types";

export function getSafeSettings({ networkId, safeAddress }) {
  return {
    type: GET_SAFE_SETTINGS,
    networkId,
    safeAddress,
  };
}

export function getSafeSettingsSuccess({ settings }) {
  return {
    type: GET_SAFE_SETTINGS_SUCCESS,
    settings,
  };
}

export function getSafeSettingsError({ error }) {
  return {
    type: GET_SAFE_SETTINGS_ERROR,
    error,
  };
}

export function setSafeSettings({
  networkId,
  safeAddress,
  userAddress,
  gasSetting,
  onSuccess,
  onError
}) {
  return {
    type: SET_SAFE_SETTINGS,
    networkId,
    safeAddress,
    userAddress,
    gasSetting,
    onSuccess,
    onError
  };
}
