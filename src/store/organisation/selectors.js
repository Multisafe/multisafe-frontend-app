import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectOrganisation = (state) => state.organisation || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectOrganisation,
    (organisationState) => organisationState.loading
  );

const makeSelectUpdating = () =>
  createSelector(
    selectOrganisation,
    (organisationState) => organisationState.updating
  );

const makeSelectError = () =>
  createSelector(
    selectOrganisation,
    (organisationState) => organisationState.error
  );

export {
  selectOrganisation,
  makeSelectLoading,
  makeSelectUpdating,
  makeSelectError,
};
