import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectStats = (state) => state.stats || initialState;

const makeSelectLoading = () =>
  createSelector(selectStats, (statsState) => statsState.loading);

const makeSelectAdminStats = () =>
  createSelector(selectStats, (statsState) => statsState.stats);

const makeSelectError = () =>
  createSelector(selectStats, (statsState) => statsState.error);

export {
  selectStats,
  makeSelectAdminStats,
  makeSelectLoading,
  makeSelectError,
};
