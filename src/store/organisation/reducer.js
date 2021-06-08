import produce from "immer";
import {
  MODIFY_ORGANISATION_NAME,
  MODIFY_ORGANISATION_NAME_SUCCESS,
  MODIFY_ORGANISATION_NAME_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  organisationName: "",
  error: false,
  log: "",
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
    }
  });

export default reducer;
