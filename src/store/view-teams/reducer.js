import produce from "immer";
import { GET_TEAMS, GET_TEAMS_SUCCESS, GET_TEAMS_ERROR } from "./action-types";

export const initialState = {
  loading: false,
  teams: undefined,
  error: false,
  teammatesCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_TEAMS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_TEAMS_SUCCESS:
        draft.loading = false;
        draft.teams = action.teams;
        draft.teammatesCount = action.teammatesCount;
        break;

      case GET_TEAMS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
