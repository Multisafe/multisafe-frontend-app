import produce from "immer";
import {
  DELETE_TEAM,
  DELETE_TEAM_ERROR,
  DELETE_TEAM_SUCCESS,
} from "./action-types";

export const initialState = {
  error: false,
  departmentId: "",
  log: "",
  updating: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DELETE_TEAM:
        draft.updating = true;
        draft.error = false;
        break;

      case DELETE_TEAM_ERROR:
        draft.updating = false;
        draft.error = action.error;
        break;

      case DELETE_TEAM_SUCCESS:
        draft.updating = false;
        draft.departmentId = action.departmentId;
        draft.log = action.log;
        break;
    }
  });

export default reducer;
