import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectSafeDetails = (state) => state.safe || initialState;

const makeSelectLoading = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.loading);

const makeSelectOwners = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.owners);

const makeSelectNonce = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.nonce);

const makeSelectError = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.error);

export {
  selectSafeDetails,
  makeSelectOwners,
  makeSelectNonce,
  makeSelectLoading,
  makeSelectError,
};
