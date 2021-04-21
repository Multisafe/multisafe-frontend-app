import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectViewTeams = (state) => state.viewTeams || initialState;

const makeSelectLoading = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.loading);

const makeSelectTeams = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.teams);
const makeSelectPeopleCount = () =>
  createSelector(
    selectViewTeams,
    (viewTeamsState) => viewTeamsState.teammatesCount
  );

const makeSelectError = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.error);

export {
  selectViewTeams,
  makeSelectTeams,
  makeSelectPeopleCount,
  makeSelectLoading,
  makeSelectError,
};
