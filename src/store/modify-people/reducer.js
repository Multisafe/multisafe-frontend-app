import produce from "immer";
import {
  EDIT_PEOPLE,
  EDIT_PEOPLE_SUCCESS,
  EDIT_PEOPLE_ERROR,
  DELETE_PEOPLE,
  DELETE_PEOPLE_SUCCESS,
  DELETE_PEOPLE_ERROR,
} from "./action-types";

export const initialState = {
  error: false,
  updating: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case EDIT_PEOPLE:
      case DELETE_PEOPLE:
        draft.updating = true;
        break;

      case EDIT_PEOPLE_SUCCESS:
      case DELETE_PEOPLE_SUCCESS:
        draft.updating = false;
        break;

      case EDIT_PEOPLE_ERROR:
      case DELETE_PEOPLE_ERROR:
        draft.updating = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
