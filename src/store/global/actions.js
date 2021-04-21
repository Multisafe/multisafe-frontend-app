import {
  SET_OWNER_ADDRESS,
  SET_OWNER_NAME,
  SET_OWNER_DETAILS,
  SET_OWNERS_AND_THRESHOLD,
  CLEAR_GLOBAL_STATE,
  SET_ORGANISATION_TYPE,
} from "./action-types";

export function setOwnerName(name) {
  return {
    type: SET_OWNER_NAME,
    name,
  };
}

export function setOwnerAddress(address) {
  return {
    type: SET_OWNER_ADDRESS,
    address,
  };
}

export function setOwnerDetails(name, address, createdBy) {
  return {
    type: SET_OWNER_DETAILS,
    name,
    address, // safe address
    createdBy,
  };
}

export function setOwnersAndThreshold(owners, threshold) {
  return {
    type: SET_OWNERS_AND_THRESHOLD,
    owners,
    threshold,
  };
}

export function setOrganisationType(organisationType) {
  return {
    type: SET_ORGANISATION_TYPE,
    organisationType,
  };
}

export function clearGlobalState() {
  return {
    type: CLEAR_GLOBAL_STATE,
  };
}
