import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectOrganisation = (state) => state.organisation || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectOrganisation,
    (organisationState) => organisationState.loading
  );

const makeSelectError = () =>
  createSelector(
    selectOrganisation,
    (organisationState) => organisationState.error
  );

export { selectOrganisation, makeSelectLoading, makeSelectError };
