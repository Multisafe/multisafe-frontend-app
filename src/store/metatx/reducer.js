import produce from "immer";
import {
  GET_METATX_ENABLED,
  GET_METATX_ENABLED_SUCCESS,
  GET_METATX_ENABLED_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  isMetaTxEnabled: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_METATX_ENABLED:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_METATX_ENABLED_SUCCESS:
        draft.loading = false;
        draft.isMetaTxEnabled = action.isMetaTxEnabled;
        break;

      case GET_METATX_ENABLED_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
