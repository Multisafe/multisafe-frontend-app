import produce from "immer";
import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  CREATE_META_TX,
  CREATE_META_TX_SUCCESS,
  CREATE_META_TX_ERROR,
  GET_VERIFICATION_STATUS,
  GET_VERIFICATION_STATUS_SUCCESS,
  GET_VERIFICATION_STATUS_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  transactionHash: "",
  log: "",
  registering: false,
  fetching: false,
  isVerified: false,
  errorInVerify: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CREATE_META_TX:
        draft.loading = true;
        draft.error = false;
        draft.transactionHash = "";
        draft.log = "";
        break;

      case REGISTER_USER:
        draft.loading = true;
        draft.error = false;
        draft.transactionHash = "";
        draft.log = "";
        draft.registering = true;
        break;

      case REGISTER_USER_SUCCESS:
      case CREATE_META_TX_SUCCESS:
        draft.transactionHash = action.transactionHash;
        draft.log = action.log;
        draft.loading = false;
        draft.registering = false;
        break;

      case REGISTER_USER_ERROR:
      case CREATE_META_TX_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.registering = false;
        break;

      case GET_VERIFICATION_STATUS:
        draft.fetching = true;
        draft.error = false;
        draft.log = "";
        break;

      case GET_VERIFICATION_STATUS_SUCCESS:
        draft.isVerified = action.isVerified;
        draft.log = action.log;
        draft.fetching = false;
        break;

      case GET_VERIFICATION_STATUS_ERROR:
        draft.error = action.error;
        draft.fetching = false;
        break;
    }
  });

export default reducer;
