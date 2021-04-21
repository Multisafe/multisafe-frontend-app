import {
  SET_PEOPLE_DETAILS,
  TOGGLE_NOTIFICATION,
  TOGGLE_PEOPLE_DETAILS,
} from "./action-types";

export function toggleNotification(show) {
  return {
    type: TOGGLE_NOTIFICATION,
    show,
  };
}

export function togglePeopleDetails(show) {
  return {
    type: TOGGLE_PEOPLE_DETAILS,
    show,
  };
}
export function setPeopleDetails(peopleDetails) {
  return {
    type: SET_PEOPLE_DETAILS,
    peopleDetails,
  };
}
