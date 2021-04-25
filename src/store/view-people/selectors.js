/**
 * The people state selectors
 */

import { createSelector } from "reselect";
import { PEOPLE_FILTERS } from "./constants";
import { initialState } from "./reducer";

const selectViewPeople = (state) => state.viewPeople || initialState;

const makeSelectPeople = () =>
  createSelector(selectViewPeople, (viewPeopleState) => viewPeopleState.people);

const makeSelectPeopleByTeam = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.peopleByTeam
  );

const makeSelectLoading = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.loading
  );

const makeSelectDepartmentName = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.departmentName
  );

const makeSelectPeopleFilters = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.filters
  );

const makeSelectIsSearchByNameFilterApplied = () =>
  createSelector(selectViewPeople, (viewPeopleState) =>
    viewPeopleState.filters[PEOPLE_FILTERS.NAME] ? true : false
  );

const makeSelectIsSearchByTeamFilterApplied = () =>
  createSelector(selectViewPeople, (viewPeopleState) =>
    viewPeopleState.filters[PEOPLE_FILTERS.TEAM] ? true : false
  );

const makeSelectNameFilter = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.filters[PEOPLE_FILTERS.NAME]
  );

const makeSelectTeamFilter = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.filters[PEOPLE_FILTERS.TEAM]
  );

const makeSelectNoFilterApplied = () =>
  createSelector(selectViewPeople, (viewPeopleState) =>
    Object.keys(viewPeopleState.filters).every(
      (key) => !viewPeopleState.filters[key]
    )
  );

const makeSelectSearchName = () =>
  createSelector(
    selectViewPeople,
    (viewPeopleState) => viewPeopleState.searchName
  );

const makeSelectError = () =>
  createSelector(selectViewPeople, (viewPeopleState) => viewPeopleState.error);

export {
  selectViewPeople,
  makeSelectPeople,
  makeSelectLoading,
  makeSelectDepartmentName,
  makeSelectPeopleFilters,
  makeSelectSearchName,
  makeSelectNameFilter,
  makeSelectTeamFilter,
  makeSelectNoFilterApplied,
  makeSelectIsSearchByNameFilterApplied,
  makeSelectIsSearchByTeamFilterApplied,
  makeSelectError,
  makeSelectPeopleByTeam,
};
