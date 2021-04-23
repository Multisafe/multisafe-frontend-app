import produce from "immer";
import { ADD_TEAM, ADD_TEAM_SUCCESS, ADD_TEAM_ERROR } from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  departmentId: "",
  log: "",
  updating: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_TEAM:
        draft.loading = true;
        draft.error = false;
        break;

      case ADD_TEAM_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_TEAM_SUCCESS:
        draft.loading = false;
        draft.departmentId = action.departmentId;
        draft.log = action.log;
        break;
    }
  });

export default reducer;
