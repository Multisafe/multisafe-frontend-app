import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectOverview = (state) => state.overview || initialState;

const makeSelectLoading = () =>
  createSelector(selectOverview, (overviewState) => overviewState.loading);

const makeSelectMoneyIn = () =>
  createSelector(selectOverview, (overviewState) => overviewState.moneyIn);

const makeSelectMoneyOut = () =>
  createSelector(selectOverview, (overviewState) => overviewState.moneyOut);

const makeSelectError = () =>
  createSelector(selectOverview, (overviewState) => overviewState.error);

export {
  selectOverview,
  makeSelectMoneyIn,
  makeSelectMoneyOut,
  makeSelectLoading,
  makeSelectError,
};
