import {
  GET_OVERVIEW,
  GET_OVERVIEW_SUCCESS,
  GET_OVERVIEW_ERROR,
  GET_PORTFOLIO_HISTORY,
  GET_PORTFOLIO_HISTORY_SUCCESS,
  GET_PORTFOLIO_HISTORY_ERROR,
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

export function getPortfolioHistory(safeAddress) {
  return {
    type: GET_PORTFOLIO_HISTORY,
    safeAddress,
  };
}

export function getPortfolioHistorySuccess(portfolioGraphData, log) {
  return {
    type: GET_PORTFOLIO_HISTORY_SUCCESS,
    portfolioGraphData,
    log,
  };
}

export function getPortfolioHistoryError(error) {
  return {
    type: GET_PORTFOLIO_HISTORY_ERROR,
    error,
  };
}
