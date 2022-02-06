import produce from "immer";
import {
  SET_STREAM_SUMMARY,
  SET_STEP,
  UPDATE_FORM,
  RESET_STREAM_STORE,
} from "./action-types";

export const initialState = {
  summary: [],
  step: 0,
  formData: {},
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STREAM_SUMMARY:
        draft.summary = action.summary;
        break;

      case SET_STEP:
        draft.step = action.step;
        break;

      case UPDATE_FORM:
        draft.formData = { ...draft.formData, ...action.formData };
        break;

      case RESET_STREAM_STORE:
        draft.summary = initialState.summary;
        draft.step = initialState.step;
        draft.formData = initialState.formData;
        break;
    }
  });

export default reducer;
