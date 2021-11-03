import produce from "immer";
import { SET_TRANSFER_SUMMARY, SET_STEP } from "./action-types";

export const initialState = {
  summary: [],
  step: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_TRANSFER_SUMMARY:
        draft.summary = action.summary;
        break;

      case SET_STEP:
        draft.step = action.step;
        break;
    }
  });

export default reducer;
