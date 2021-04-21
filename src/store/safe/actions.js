import { GET_NONCE, GET_NONCE_SUCCESS, GET_NONCE_ERROR } from "./action-types";

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
