import produce from "immer";
import {
  GET_ADMIN_STATS,
  GET_ADMIN_STATS_SUCCESS,
  GET_ADMIN_STATS_ERROR,
  GET_ALL_SAFE_ACTIVITY,
  GET_ALL_SAFE_ACTIVITY_SUCCESS,
  GET_ALL_SAFE_ACTIVITY_ERROR,
  GET_CURRENT_SAFE_ACTIVITY,
  GET_CURRENT_SAFE_ACTIVITY_SUCCESS,
  GET_CURRENT_SAFE_ACTIVITY_ERROR,
  RESET_CURRENT_SAFE_ACTIVITY,
} from "./action-types";

export const initialState = {
  loading: false,
  stats: null,
  error: false,
  loadingAllSafeActivity: false,
  loadingCurrentSafeActivity: false,
  allSafeActivity: null,
  currentSafeActivity: null,
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

      case GET_ALL_SAFE_ACTIVITY:
        draft.loadingAllSafeActivity = true;
        draft.error = false;
        break;

      case GET_ALL_SAFE_ACTIVITY_ERROR:
        draft.loadingAllSafeActivity = false;
        draft.error = action.error;
        break;

      case GET_ALL_SAFE_ACTIVITY_SUCCESS:
        draft.loadingAllSafeActivity = false;
        draft.allSafeActivity = action.allSafeActivity;
        break;

      case GET_CURRENT_SAFE_ACTIVITY:
        draft.loadingCurrentSafeActivity = true;
        draft.error = false;
        break;

      case GET_CURRENT_SAFE_ACTIVITY_ERROR:
        draft.loadingCurrentSafeActivity = false;
        draft.error = action.error;
        break;

      case GET_CURRENT_SAFE_ACTIVITY_SUCCESS:
        draft.loadingCurrentSafeActivity = false;
        draft.currentSafeActivity = action.currentSafeActivity;
        break;

      case RESET_CURRENT_SAFE_ACTIVITY:
        draft.currentSafeActivity = null;
        break;
    }
  });

export default reducer;
