import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectModifyPeople = (state) => state.modifyPeople || initialState;

const makeSelectUpdating = () =>
  createSelector(
    selectModifyPeople,
    (modifyPeopleState) => modifyPeopleState.updating
  );

const makeSelectError = () =>
  createSelector(
    selectModifyPeople,
    (modifyPeopleState) => modifyPeopleState.error
  );

export { selectModifyPeople, makeSelectUpdating, makeSelectError };
