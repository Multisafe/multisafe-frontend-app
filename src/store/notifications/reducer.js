import produce from "immer";

import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_ERROR,
  UPDATE_NOTIFICATION_STATUS,
  UPDATE_NOTIFICATION_STATUS_SUCCESS,
  UPDATE_NOTIFICATION_STATUS_ERROR,
  OPEN_NOTIFICATIONS,
  CLOSE_NOTIFICATIONS,
} from "./action-types";

export const initialState = {
  log: "",
  loading: false,
  updating: false,
  notifications: undefined,
  hasSeen: false,
  show: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_NOTIFICATIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_NOTIFICATIONS_SUCCESS:
        draft.notifications = action.notifications;
        draft.loading = false;
        draft.log = action.log;
        draft.hasSeen = action.hasSeen;
        break;

      case GET_NOTIFICATIONS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case UPDATE_NOTIFICATION_STATUS:
        draft.updating = true;
        draft.error = false;
        break;

      case UPDATE_NOTIFICATION_STATUS_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.notifications = action.notifications;
        draft.hasSeen = action.hasSeen;
        break;

      case UPDATE_NOTIFICATION_STATUS_ERROR:
        draft.error = action.error;
        draft.updating = false;
        break;

      case OPEN_NOTIFICATIONS:
        draft.show = true;
        break;
      case CLOSE_NOTIFICATIONS:
        draft.show = false;
        break;
    }
  });

export default reducer;
