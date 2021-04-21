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

export {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
  makeSelectCreatedBy,
  makeSelectSafeOwners,
  makeSelectThreshold,
  makeSelectOrganisationType,
  makeSelectIsMultiOwner,
  makeSelectIsOrganisationPublic,
  makeSelectIsOrganisationPrivate,
};
