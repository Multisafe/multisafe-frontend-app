/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLoginWizard = (state) => state.loginWizard || initialState;

const makeSelectStep = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.step
  );

const makeSelectFormData = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.form
  );

const makeSelectFlow = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.flow
  );

const makeSelectChosenSafeAddress = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.chosenSafeAddress
  );

const makeSelectLoading = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.loading
  );

const makeSelectSafes = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.safes
  );

const makeSelectCreatedBy = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.createdBy
  );

const makeSelectGnosisSafeOwners = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.gnosisSafeOwners
  );

const makeSelectGnosisSafeThreshold = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.gnosisSafeThreshold
  );

const makeSelectFetchingSafeDetails = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.fetchingSafeDetails
  );

const makeSelectError = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.error
  );

export {
  selectLoginWizard,
  makeSelectStep,
  makeSelectFormData,
  makeSelectFlow,
  makeSelectChosenSafeAddress,
  makeSelectLoading,
  makeSelectSafes,
  makeSelectCreatedBy,
  makeSelectGnosisSafeOwners,
  makeSelectGnosisSafeThreshold,
  makeSelectFetchingSafeDetails,
  makeSelectError,
};
