import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLayout = (state) => state.layout || initialState;

const makeSelectIsNotificationOpen = () =>
  createSelector(selectLayout, (layoutState) => layoutState.isNotificationOpen);

const makeSelectIsSwitchAccountOpen = () =>
  createSelector(
    selectLayout,
    (layoutState) => layoutState.isSwitchAccountOpen
  );

const makeSelectIsPeopleDetailsOpen = () =>
  createSelector(
    selectLayout,
    (layoutState) => layoutState.isPeopleDetailsOpen
  );

const makeSelectPeopleDetails = () =>
  createSelector(selectLayout, (layoutState) => layoutState.peopleDetails);

export {
  selectLayout,
  makeSelectIsNotificationOpen,
  makeSelectIsPeopleDetailsOpen,
  makeSelectIsSwitchAccountOpen,
  makeSelectPeopleDetails,
};
