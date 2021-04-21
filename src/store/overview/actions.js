import {
  GET_OVERVIEW,
  GET_OVERVIEW_SUCCESS,
  GET_OVERVIEW_ERROR,
} from "./action-types";

export function getOverview(safeAddress) {
  return {
    type: GET_OVERVIEW,
    safeAddress,
  };
}

export function getOverviewSuccess(moneyIn, moneyOut) {
  return {
    type: GET_OVERVIEW_SUCCESS,
    moneyIn,
    moneyOut,
  };
}

export function getOverviewError(error) {
  return {
    type: GET_OVERVIEW_ERROR,
    error,
  };
}
