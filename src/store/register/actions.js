import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  CREATE_META_TX,
  CREATE_META_TX_SUCCESS,
  CREATE_META_TX_ERROR,
  GET_VERIFICATION_STATUS,
  GET_VERIFICATION_STATUS_SUCCESS,
  GET_VERIFICATION_STATUS_ERROR,
} from "./action-types";

export function registerUser(body, networkId) {
  return {
    type: REGISTER_USER,
    body,
    networkId,
  };
}

export function registerUserSuccess(transactionHash, log) {
  return {
    type: REGISTER_USER_SUCCESS,
    transactionHash,
    log,
  };
}

export function registerUserError(error) {
  return {
    type: REGISTER_USER_ERROR,
    error,
  };
}

export function createMetaTx(body) {
  return {
    type: CREATE_META_TX,
    body,
  };
}

export function createMetaTxSuccess(transactionHash, log) {
  return {
    type: CREATE_META_TX_SUCCESS,
    transactionHash,
    log,
  };
}

export function createMetaTxError(error) {
  return {
    type: CREATE_META_TX_ERROR,
    error,
  };
}

export function getVerificationStatus({ password, owner, networkId }) {
  return {
    type: GET_VERIFICATION_STATUS,
    password,
    owner,
    networkId,
  };
}

export function getVerificationStatusSuccess(isVerified, log) {
  return {
    type: GET_VERIFICATION_STATUS_SUCCESS,
    isVerified,
    log,
  };
}

export function getVerificationStatusError(error) {
  return {
    type: GET_VERIFICATION_STATUS_ERROR,
    error,
  };
}
