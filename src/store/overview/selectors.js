import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectOverview = (state) => state.overview || initialState;

const makeSelectLoading = () =>
  createSelector(selectOverview, (overviewState) => overviewState.loading);

const makeSelectMoneyIn = () =>
  createSelector(selectOverview, (overviewState) => overviewState.moneyIn);

const makeSelectMoneyOut = () =>
  createSelector(selectOverview, (overviewState) => overviewState.moneyOut);

const makeSelectPortfolioGraphData = () =>
  createSelector(
    selectOverview,
    (overviewState) => overviewState.portfolioGraphData
  );

const makeSelectLoadingPortfolio = () =>
  createSelector(
    selectOverview,
    (overviewState) => overviewState.loadingPortfolio
  );

const makeSelectError = () =>
  createSelector(selectOverview, (overviewState) => overviewState.error);

export {
  selectOverview,
  makeSelectMoneyIn,
  makeSelectMoneyOut,
  makeSelectLoading,
  makeSelectPortfolioGraphData,
  makeSelectLoadingPortfolio,
  makeSelectError,
};
