import produce from "immer";
import {
  UPDATE_FORM,
  ADD_PEOPLE,
  ADD_PEOPLE_ERROR,
  ADD_PEOPLE_SUCCESS,
  ADD_BULK_PEOPLE,
  ADD_BULK_PEOPLE_ERROR,
  ADD_BULK_PEOPLE_SUCCESS,
} from "./action-types";

export const initialState = {
  form: {},
  loading: false,
  error: false,
  success: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_FORM:
        if (action.formData) draft.form = { ...draft.form, ...action.formData };
        else draft.form = {};
        break;

      case ADD_PEOPLE:
      case ADD_BULK_PEOPLE:
        draft.loading = true;
        draft.error = false;
        draft.success = false;
        break;

      case ADD_PEOPLE_ERROR:
      case ADD_BULK_PEOPLE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_PEOPLE_SUCCESS:
      case ADD_BULK_PEOPLE_SUCCESS:
        draft.loading = false;
        draft.success = true;
        break;
    }
  });

export default reducer;
