import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectStats = (state) => state.stats || initialState;

const makeSelectLoading = () =>
  createSelector(selectStats, (statsState) => statsState.loading);

const makeSelectAdminStats = () =>
  createSelector(selectStats, (statsState) => statsState.stats);

const makeSelectError = () =>
  createSelector(selectStats, (statsState) => statsState.error);

const makeSelectLoadingAllSafeActivity = () =>
  createSelector(
    selectStats,
    (statsState) => statsState.loadingAllSafeActivity
  );

const makeSelectAllSafeActivity = () =>
  createSelector(selectStats, (statsState) => statsState.allSafeActivity);

const makeSelectLoadingCurrentSafeActivity = () =>
  createSelector(
    selectStats,
    (statsState) => statsState.loadingCurrentSafeActivity
  );

const makeSelectCurrentSafeActivity = () =>
  createSelector(selectStats, (statsState) => statsState.currentSafeActivity);

export {
  selectStats,
  makeSelectAdminStats,
  makeSelectLoading,
  makeSelectError,
  makeSelectLoadingAllSafeActivity,
  makeSelectAllSafeActivity,
  makeSelectLoadingCurrentSafeActivity,
  makeSelectCurrentSafeActivity,
};
