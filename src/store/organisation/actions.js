import {
  MODIFY_ORGANISATION_NAME,
  MODIFY_ORGANISATION_NAME_SUCCESS,
  MODIFY_ORGANISATION_NAME_ERROR,
  GET_DATA_SHARING,
  GET_DATA_SHARING_SUCCESS,
  GET_DATA_SHARING_ERROR,
  TOGGLE_DATA_SHARING,
  TOGGLE_DATA_SHARING_SUCCESS,
  TOGGLE_DATA_SHARING_ERROR,
} from "./action-types";

export function modifyOrganisationName(organisationName, safeAddress) {
  return {
    type: MODIFY_ORGANISATION_NAME,
    organisationName,
    safeAddress,
  };
}

export function modifyOrganisationNameSuccess(organisationName, log) {
  return {
    type: MODIFY_ORGANISATION_NAME_SUCCESS,
    organisationName,
    log,
  };
}

export function modifyOrganisationNameError(error) {
  return {
    type: MODIFY_ORGANISATION_NAME_ERROR,
    error,
  };
}

export function getDataSharing(safeAddress) {
  return {
    type: GET_DATA_SHARING,
    safeAddress,
  };
}

export function getDataSharingSuccess(isEnabled, log) {
  return {
    type: GET_DATA_SHARING_SUCCESS,
    isEnabled,
    log,
  };
}

export function getDataSharingError(error) {
  return {
    type: GET_DATA_SHARING_ERROR,
    error,
  };
}

export function toggleDataSharing(isEnabled, safeAddress) {
  return {
    type: TOGGLE_DATA_SHARING,
    isEnabled,
    safeAddress,
  };
}

export function toggleDataSharingSuccess(log) {
  return {
    type: TOGGLE_DATA_SHARING_SUCCESS,
    log,
  };
}

export function toggleDataSharingError(error) {
  return {
    type: TOGGLE_DATA_SHARING_ERROR,
    error,
  };
}
