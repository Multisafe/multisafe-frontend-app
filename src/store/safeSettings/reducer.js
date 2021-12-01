import produce from "immer";
import {
  GET_SAFE_SETTINGS,
  GET_SAFE_SETTINGS_ERROR,
  GET_SAFE_SETTINGS_SUCCESS,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  settings: null,
};

export const safeSettingsKey = "safeSettings";

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_SAFE_SETTINGS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_SAFE_SETTINGS_ERROR:
        draft.settings = null;
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_SAFE_SETTINGS_SUCCESS:
        draft.settings = action.settings;
        draft.loading = false;
        draft.error = false;
        break;
    }
  });

export default reducer;
