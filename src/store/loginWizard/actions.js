import {
  CHOOSE_STEP,
  UPDATE_FORM,
  SELECT_FLOW,
  CHOOSE_SAFE,
  GET_SAFES,
  GET_SAFES_SUCCESS,
  GET_SAFES_ERROR,
  GET_PARCEL_SAFES,
  FETCH_SAFES,
  GET_SAFE_OWNERS,
  GET_SAFE_OWNERS_SUCCESS,
  GET_SAFE_OWNERS_ERROR,
} from "./action-types";

export function chooseStep(step) {
  return {
    type: CHOOSE_STEP,
    step,
  };
}

export function updateForm(formData) {
  return {
    type: UPDATE_FORM,
    formData,
  };
}

export function selectFlow(flow) {
  return {
    type: SELECT_FLOW,
    flow,
  };
}

export function chooseSafe(safeAddress) {
  return {
    type: CHOOSE_SAFE,
    safeAddress,
  };
}

export function fetchSafes(owner) {
  return {
    type: FETCH_SAFES,
    owner,
  };
}

export function getParcelSafes(owner, status = 1) {
  return {
    type: GET_PARCEL_SAFES,
    owner,
    status,
  };
}

// status = 0 => get safes from cache
// status = 1 => get safes from gnosis api
export function getSafes(owner, status = 0) {
  return {
    type: GET_SAFES,
    owner,
    status,
  };
}

export function getSafesSuccess(safes, createdBy, log) {
  return {
    type: GET_SAFES_SUCCESS,
    safes,
    createdBy,
    log,
  };
}

export function getSafesError(error) {
  return {
    type: GET_SAFES_ERROR,
    error,
  };
}

export function getSafeOwners(owner) {
  return {
    type: GET_SAFE_OWNERS,
    owner,
  };
}

export function getSafeOwnersSuccess(owners, threshold, log) {
  return {
    type: GET_SAFE_OWNERS_SUCCESS,
    owners,
    threshold,
    log,
  };
}

export function getSafeOwnersError(error) {
  return {
    type: GET_SAFE_OWNERS_ERROR,
    error,
  };
}
