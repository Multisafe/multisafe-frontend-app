import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectAddPeople = (state) => state.addPeople || initialState;

const makeSelectFormData = () =>
  createSelector(selectAddPeople, (addPeopleState) => addPeopleState.form);

const makeSelectLoading = () =>
  createSelector(selectAddPeople, (addPeopleState) => addPeopleState.loading);

const makeSelectSuccess = () =>
  createSelector(selectAddPeople, (addPeopleState) => addPeopleState.success);

const makeSelectError = () =>
  createSelector(selectAddPeople, (addPeopleState) => addPeopleState.error);

export {
  selectAddPeople,
  makeSelectFormData,
  makeSelectSuccess,
  makeSelectLoading,
  makeSelectError,
};
