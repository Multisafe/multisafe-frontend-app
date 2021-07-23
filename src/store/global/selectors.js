/**
 * The global state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectGlobal = (state) => state.global || initialState;

const makeSelectOwnerName = () =>
  createSelector(selectGlobal, (globalState) => globalState.ownerName);

const makeSelectOwnerSafeAddress = () =>
  createSelector(selectGlobal, (globalState) => globalState.ownerSafeAddress);

const makeSelectCreatedBy = () =>
  createSelector(selectGlobal, (globalState) => globalState.createdBy);

const makeSelectSafeOwners = () =>
  createSelector(selectGlobal, (globalState) => globalState.owners);

const makeSelectThreshold = () =>
  createSelector(selectGlobal, (globalState) => globalState.threshold);

const makeSelectIsMultiOwner = () =>
  createSelector(selectGlobal, (globalState) => globalState.threshold > 1);

const makeSelectOrganisationType = () =>
  createSelector(selectGlobal, (globalState) => globalState.organisationType);

const makeSelectIsOwner = () =>
  createSelector(selectGlobal, (globalState) => globalState.isOwner);

const makeSelectIsReadOnly = () =>
  createSelector(selectGlobal, (globalState) => globalState.isReadOnly);

const makeSelectIsOrganisationPrivate = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.organisationType === 0
  );

const makeSelectIsOrganisationPublic = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.organisationType === 1
  );

const makeSelectIsDataSharingAllowed = () =>
  createSelector(selectGlobal, (globalState) => globalState.dataSharingAllowed);

const makeSelectGasMode = () =>
  createSelector(selectGlobal, (globalState) => globalState.gasMode);

export {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
  makeSelectCreatedBy,
  makeSelectSafeOwners,
  makeSelectThreshold,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
  makeSelectIsMultiOwner,
  makeSelectIsOrganisationPublic,
  makeSelectIsOrganisationPrivate,
  makeSelectIsOwner,
  makeSelectIsDataSharingAllowed,
  makeSelectGasMode,
};
