import produce from "immer";
import {
  CHOOSE_STEP,
  UPDATE_FORM,
  CHOOSE_SAFE,
  GET_SAFES,
  GET_SAFES_SUCCESS,
  GET_SAFES_ERROR,
  SELECT_FLOW,
  FETCH_SAFES,
  GET_PARCEL_SAFES,
  GET_SAFE_OWNERS,
  GET_SAFE_OWNERS_SUCCESS,
  GET_SAFE_OWNERS_ERROR,
} from "./action-types";

export const initialState = {
  step: 0,
  form: {},
  loading: false,
  safes: [],
  error: false,
  flow: "", // LOGIN or IMPORT,
  chosenSafeAddress: "",
  createdBy: "",
  gnosisSafeOwners: [], // for IMPORT flow
  gnosisSafeThreshold: 0, //for IMPORT flow
  fetchingSafeDetails: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CHOOSE_STEP:
        draft.step = action.step;
        break;

      case UPDATE_FORM:
        draft.form = { ...draft.form, ...action.formData };
        break;

      case SELECT_FLOW:
        draft.flow = action.flow;
        break;

      case CHOOSE_SAFE:
        draft.chosenSafeAddress = action.safeAddress;
        break;

      case GET_SAFES:
      case FETCH_SAFES:
      case GET_PARCEL_SAFES:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_SAFES_SUCCESS:
        draft.loading = false;
        draft.safes = action.safes;
        draft.createdBy = action.createdBy;
        break;

      case GET_SAFES_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_SAFE_OWNERS:
        draft.fetchingSafeDetails = true;
        draft.error = false;
        break;

      case GET_SAFE_OWNERS_SUCCESS:
        draft.fetchingSafeDetails = false;
        draft.gnosisSafeOwners = action.owners;
        draft.gnosisSafeThreshold = action.threshold;
        break;

      case GET_SAFE_OWNERS_ERROR:
        draft.fetchingSafeDetails = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
