import produce from "immer";
import { GET_NONCE, GET_NONCE_SUCCESS, GET_NONCE_ERROR } from "./action-types";

export const initialState = {
  loading: false,
  updating: false,
  nonce: undefined,
  threshold: undefined,
  owners: [],
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_NONCE:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_NONCE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_NONCE_SUCCESS:
        draft.loading = false;
        draft.nonce = action.countUniqueNonce;
        break;
    }
  });

export default reducer;
