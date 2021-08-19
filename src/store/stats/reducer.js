import produce from "immer";
import {
  GET_ADMIN_STATS,
  GET_ADMIN_STATS_SUCCESS,
  GET_ADMIN_STATS_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  stats: null,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_ADMIN_STATS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_ADMIN_STATS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_ADMIN_STATS_SUCCESS:
        draft.loading = false;
        draft.stats = action.stats;
        break;
    }
  });

export default reducer;
