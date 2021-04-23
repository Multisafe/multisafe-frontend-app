/**
 * The add team state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectAddTeam = (state) => state.addTeam || initialState;

const makeSelectFormData = () =>
  createSelector(selectAddTeam, (addTeamState) => addTeamState.form);

const makeSelectDepartmentId = () =>
  createSelector(selectAddTeam, (addTeamState) => addTeamState.departmentId);

const makeSelectLoading = () =>
  createSelector(selectAddTeam, (addTeamState) => addTeamState.loading);

const makeSelectUpdating = () =>
  createSelector(selectAddTeam, (addTeamState) => addTeamState.updating);

const makeSelectError = () =>
  createSelector(selectAddTeam, (addTeamState) => addTeamState.error);

export {
  selectAddTeam,
  makeSelectFormData,
  makeSelectDepartmentId,
  makeSelectLoading,
  makeSelectUpdating,
  makeSelectError,
};
