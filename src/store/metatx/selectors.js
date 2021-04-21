import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectMetaTx = (state) => state.metatx || initialState;

const makeSelectLoading = () =>
  createSelector(selectMetaTx, (metaTxState) => metaTxState.loading);

const makeSelectIsMetaTxEnabled = () =>
  createSelector(selectMetaTx, (metaTxState) => metaTxState.isMetaTxEnabled);

const makeSelectError = () =>
  createSelector(selectMetaTx, (metaTxState) => metaTxState.error);

export { makeSelectIsMetaTxEnabled, makeSelectLoading, makeSelectError };
