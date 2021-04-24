import {
  GET_NONCE,
  GET_NONCE_SUCCESS,
  GET_NONCE_ERROR,
  UPDATE_OWNER_NAME,
  UPDATE_OWNER_NAME_SUCCESS,
  UPDATE_OWNER_NAME_ERROR,
} from "./action-types";

export function getNonce(safeAddress) {
  return {
    type: GET_NONCE,
    safeAddress,
  };
}

export function getNonceSuccess(count, countUniqueNonce) {
  return {
    type: GET_NONCE_SUCCESS,
    count,
    countUniqueNonce,
  };
}

export function getNonceError(error) {
  return {
    type: GET_NONCE_ERROR,
    error,
  };
}

export function updateOwnerName({ ownerAddress, name, safeAddress }) {
  return {
    type: UPDATE_OWNER_NAME,
    ownerAddress,
    name,
    safeAddress,
  };
}

export function updateOwnerNameSuccess(log) {
  return {
    type: UPDATE_OWNER_NAME_SUCCESS,
    log,
  };
}

export function updateOwnerNameError(error) {
  return {
    type: UPDATE_OWNER_NAME_ERROR,
    error,
  };
}
