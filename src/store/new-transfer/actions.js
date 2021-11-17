import {
  SET_TRANSFER_SUMMARY,
  SET_STEP,
  UPDATE_FORM,
  RESET_TRANSFER_STORE,
} from "./action-types";

export function setTransferSummary(summary) {
  return {
    type: SET_TRANSFER_SUMMARY,
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
    type: RESET_TRANSFER_STORE,
  };
}
