import {
  GET_TOKENS,
  GET_TOKENS_SUCCESS,
  GET_TOKENS_ERROR,
  ADD_CUSTOM_TOKEN,
  ADD_CUSTOM_TOKEN_SUCCESS,
  ADD_CUSTOM_TOKEN_ERROR,
  SET_SUCCESS,
} from "./action-types";

export function getTokens(safeAddress) {
  return {
    type: GET_TOKENS,
    safeAddress,
  };
}

export function getTokensSuccess(tokens, prices, icons, log) {
  return {
    type: GET_TOKENS_SUCCESS,
    tokens,
    prices,
    icons,
    log,
  };
}

export function getTokensError(error) {
  return {
    type: GET_TOKENS_ERROR,
    error,
  };
}

export function addCustomToken(safeAddress, contractAddress) {
  return {
    type: ADD_CUSTOM_TOKEN,
    safeAddress,
    contractAddress,
  };
}

export function addCustomTokenSuccess(transactions, log) {
  return {
    type: ADD_CUSTOM_TOKEN_SUCCESS,
    transactions,
    log,
  };
}

export function addCustomTokenError(error) {
  return {
    type: ADD_CUSTOM_TOKEN_ERROR,
    error,
  };
}
export function setSuccess(bool = true) {
  return {
    type: SET_SUCCESS,
    bool,
  };
}
