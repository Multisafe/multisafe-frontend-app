import produce from "immer";
import {
  GET_OVERVIEW,
  GET_OVERVIEW_SUCCESS,
  GET_OVERVIEW_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  moneyIn: 0,
  moneyOut: 0,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_OVERVIEW:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_OVERVIEW_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_OVERVIEW_SUCCESS:
        draft.loading = false;
        draft.moneyIn = action.moneyIn;
        draft.moneyOut = action.moneyOut;
        break;
    }
  });

export default reducer;
