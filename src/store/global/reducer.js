import produce from "immer";
import {
  SET_OWNER_NAME,
  SET_SAFE_ADDRESS,
  SET_OWNER_DETAILS,
  SET_OWNERS_AND_THRESHOLD,
  CLEAR_GLOBAL_STATE,
  SET_ORGANISATION_TYPE,
  SET_READ_ONLY,
  GET_SAFE_INFO,
  GET_SAFE_INFO_SUCCESS,
  GET_SAFE_INFO_ERROR,
} from "./action-types";

export const initialState = {
  ownerName: "",
  ownerSafeAddress: "",
  createdBy: "",
  owners: [], // [{name: "123", owner: "0x123"}]
  threshold: 0,
  organisationType: undefined,
  isOwner: true,
  loading: false,
  error: false,
  isReadOnly: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_OWNER_NAME:
        draft.ownerName = action.name;
        break;

      case SET_SAFE_ADDRESS:
        draft.ownerSafeAddress = action.safeAddress;
        break;

      case SET_OWNER_DETAILS:
        draft.ownerName = action.name;
        draft.ownerSafeAddress = action.address;
        draft.createdBy = action.createdBy;
        break;

      case SET_OWNERS_AND_THRESHOLD:
        draft.owners = action.owners;
        draft.threshold = action.threshold;
        break;

      case SET_ORGANISATION_TYPE:
        draft.organisationType = action.organisationType;
        break;

      case SET_READ_ONLY:
        draft.isReadOnly = action.isReadOnly;
        break;

      case CLEAR_GLOBAL_STATE:
        draft.ownerName = "";
        draft.ownerSafeAddress = "";
        draft.createdBy = "";
        draft.owners = [];
        draft.threshold = 0;
        draft.organisationType = undefined;
        draft.isOwner = true;
        break;

      case GET_SAFE_INFO:
        draft.loading = true;
        break;
      case GET_SAFE_INFO_SUCCESS:
        draft.loading = false;
        draft.owners = action.owners;
        draft.threshold = action.threshold;
        draft.isOwner = action.isOwner;
        draft.organisationType = action.organisationType;
        draft.ownerName = action.name;
        draft.ownerSafeAddress = action.safeAddress;
        break;
      case GET_SAFE_INFO_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
