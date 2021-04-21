import produce from "immer";
import {
  GET_ALL_PEOPLE,
  GET_ALL_PEOPLE_SUCCESS,
  GET_ALL_PEOPLE_ERROR,
  GET_PEOPLE_BY_DEPARTMENT,
  GET_PEOPLE_BY_DEPARTMENT_SUCCESS,
  GET_PEOPLE_BY_DEPARTMENT_ERROR,
  ADD_PEOPLE_FILTER,
  REMOVE_PEOPLE_FILTER,
  SET_SEARCH_NAME,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  people: undefined,
  departmentName: "",
  filters: {}, // {name: "john", department: "Engineering", ...}
  searchName: "",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_ALL_PEOPLE:
      case GET_PEOPLE_BY_DEPARTMENT:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_ALL_PEOPLE_ERROR:
      case GET_PEOPLE_BY_DEPARTMENT_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_ALL_PEOPLE_SUCCESS:
      case GET_PEOPLE_BY_DEPARTMENT_SUCCESS:
        draft.loading = false;
        draft.people = action.people;
        draft.departmentName = action.departmentName || "";
        break;

      case ADD_PEOPLE_FILTER:
        draft.filters = { ...state.filter, [action.filter]: action.value };
        break;

      case REMOVE_PEOPLE_FILTER:
        draft.filters = { ...state.filter, [action.filter]: undefined };
        break;

      case SET_SEARCH_NAME:
        draft.searchName = action.name;
        break;
    }
  });

export default reducer;
