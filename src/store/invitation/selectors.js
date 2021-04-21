import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectInvitation = (state) => state.invitation || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.loading
  );

const makeSelectSafeOwners = () =>
  createSelector(selectInvitation, (invitationState) => invitationState.owners);

const makeSelectError = () =>
  createSelector(selectInvitation, (invitationState) => invitationState.error);

const makeSelectSuccess = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.success
  );

const makeSelectCreating = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.creating
  );

const makeSelectApproving = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.approving
  );

const makeSelectCreatedBy = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.createdBy
  );

const makeSelectIsSetupComplete = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.setupCompleted
  );

export {
  selectInvitation,
  makeSelectSafeOwners,
  makeSelectLoading,
  makeSelectError,
  makeSelectSuccess,
  makeSelectIsSetupComplete,
  makeSelectCreating,
  makeSelectApproving,
  makeSelectCreatedBy,
};
