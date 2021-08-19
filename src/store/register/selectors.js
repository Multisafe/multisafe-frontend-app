/**
 * The register state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectRegister = (state) => state.register || initialState;

const makeSelectLoading = () =>
  createSelector(selectRegister, (registerState) => registerState.loading);

const makeSelectError = () =>
  createSelector(selectRegister, (registerState) => registerState.error);

const makeSelectTransactionHash = () =>
  createSelector(
    selectRegister,
    (registerState) => registerState.transactionHash
  );

const makeSelectLog = () =>
  createSelector(selectRegister, (registerState) => registerState.log);

const makeSelectRegistering = () =>
  createSelector(selectRegister, (registerState) => registerState.registering);

export {
  selectRegister,
  makeSelectLoading,
  makeSelectError,
  makeSelectTransactionHash,
  makeSelectLog,
  makeSelectRegistering,
};
