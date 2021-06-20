import produce from "immer";
import {
  MODIFY_ORGANISATION_NAME,
  MODIFY_ORGANISATION_NAME_SUCCESS,
  MODIFY_ORGANISATION_NAME_ERROR,
  TOGGLE_DATA_SHARING,
  TOGGLE_DATA_SHARING_SUCCESS,
  TOGGLE_DATA_SHARING_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  organisationName: "",
  error: false,
  log: "",
  updating: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MODIFY_ORGANISATION_NAME:
        draft.loading = true;
        draft.error = false;
        break;

      case MODIFY_ORGANISATION_NAME_SUCCESS:
        draft.loading = false;
        draft.organisationName = action.organisationName;
        break;

      case MODIFY_ORGANISATION_NAME_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case TOGGLE_DATA_SHARING:
        draft.updating = true;
        draft.error = false;
        break;

      case TOGGLE_DATA_SHARING_SUCCESS:
        draft.updating = false;
        break;

      case TOGGLE_DATA_SHARING_ERROR:
        draft.updating = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
