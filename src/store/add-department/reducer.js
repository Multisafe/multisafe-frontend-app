import produce from "immer";
import {
  UPDATE_FORM,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_ERROR,
  ADD_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_ERROR,
  DELETE_DEPARTMENT_SUCCESS,
} from "./action-types";

export const initialState = {
  form: {},
  loading: false,
  error: false,
  departmentId: "",
  log: "",
  updating: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_FORM:
        draft.form = { ...draft.form, ...action.formData };
        break;

      case ADD_DEPARTMENT:
        draft.loading = true;
        draft.error = false;
        break;

      case ADD_DEPARTMENT_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_DEPARTMENT_SUCCESS:
        draft.loading = false;
        draft.departmentId = action.departmentId;
        draft.log = action.log;
        break;

      case DELETE_DEPARTMENT:
        draft.updating = true;
        draft.error = false;
        break;

      case DELETE_DEPARTMENT_ERROR:
        draft.updating = false;
        draft.error = action.error;
        break;

      case DELETE_DEPARTMENT_SUCCESS:
        draft.updating = false;
        draft.departmentId = action.departmentId;
        draft.log = action.log;
        break;
    }
  });

export default reducer;
