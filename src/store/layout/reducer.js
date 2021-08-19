import produce from "immer";
import {
  TOGGLE_NOTIFICATION,
  TOGGLE_PEOPLE_DETAILS,
  SET_PEOPLE_DETAILS,
} from "./action-types";

export const initialState = {
  isNotificationOpen: false,
  isPeopleDetailsOpen: false,
  peopleDetails: null,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case TOGGLE_NOTIFICATION:
        draft.isNotificationOpen = action.show;
        break;
      case TOGGLE_PEOPLE_DETAILS:
        draft.isPeopleDetailsOpen = action.show;
        break;
      case SET_PEOPLE_DETAILS:
        draft.peopleDetails = action.peopleDetails;
        break;
    }
  });

export default reducer;
