import {
  MODIFY_ORGANISATION_NAME,
  MODIFY_ORGANISATION_NAME_SUCCESS,
  MODIFY_ORGANISATION_NAME_ERROR,
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

export function toggleDataSharing(isDataSharingAllowed, safeAddress) {
  return {
    type: TOGGLE_DATA_SHARING,
    isDataSharingAllowed,
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
