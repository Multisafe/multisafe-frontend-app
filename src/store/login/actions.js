import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  IMPORT_SAFE,
} from "./action-types";

export function loginUser(safeAddress, encryptionKeyData) {
  return {
    type: LOGIN_USER,
    safeAddress,
    encryptionKeyData,
  };
}

export function loginUserSuccess(safeAddress, log) {
  return {
    type: LOGIN_USER_SUCCESS,
    safeAddress,
    log,
  };
}

export function loginUserError(error) {
  return {
    type: LOGIN_USER_ERROR,
    error,
  };
}

export function setImportSafeFlag(flag) {
  return {
    type: IMPORT_SAFE,
    flag,
  };
}
