/**
 * The modify department state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectModifyTeam = (state) => state.modifyTeam || initialState;

const makeSelectDepartmentId = () =>
  createSelector(
    selectModifyTeam,
    (modifyTeamState) => modifyTeamState.departmentId
  );

const makeSelectUpdating = () =>
  createSelector(
    selectModifyTeam,
    (modifyTeamState) => modifyTeamState.updating
  );

const makeSelectError = () =>
  createSelector(selectModifyTeam, (modifyTeamState) => modifyTeamState.error);

export {
  selectModifyTeam,
  makeSelectDepartmentId,
  makeSelectUpdating,
  makeSelectError,
};
