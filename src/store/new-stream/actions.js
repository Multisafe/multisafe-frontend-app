import {
  SET_STREAM_SUMMARY,
  SET_STEP,
  UPDATE_FORM,
  RESET_STREAM_STORE,
} from "./action-types";

export function setStreamSummary(summary) {
  return {
    type: SET_STREAM_SUMMARY,
    summary,
  };
}

export function selectStep(step) {
  return {
    type: SET_STEP,
    step,
  };
}

export function updateForm(formData) {
  return {
    type: UPDATE_FORM,
    formData,
  };
}

export function resetTransferStore() {
  return {
    type: RESET_STREAM_STORE,
  };
}
