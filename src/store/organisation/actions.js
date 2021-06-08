import {
  MODIFY_ORGANISATION_NAME,
  MODIFY_ORGANISATION_NAME_SUCCESS,
  MODIFY_ORGANISATION_NAME_ERROR,
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
