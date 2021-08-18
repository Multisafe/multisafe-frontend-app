import {
  GET_GAS_PRICE,
  GET_GAS_PRICE_SUCCESS,
  GET_GAS_PRICE_ERROR,
  SET_SELECTED_GAS_PRICE,
} from "./action-types";

export function getGasPrice() {
  return {
    type: GET_GAS_PRICE,
  };
}

export function getGasPriceSuccess(gasPrices, log) {
  return {
    type: GET_GAS_PRICE_SUCCESS,
    gasPrices,
    log,
  };
}

export function getGasPriceError(error) {
  return {
    type: GET_GAS_PRICE_ERROR,
    error,
  };
}

export function setSelectedGasPrice(gasPrice) {
  return {
    type: SET_SELECTED_GAS_PRICE,
    gasPrice,
  };
}
