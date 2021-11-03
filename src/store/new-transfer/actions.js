import { SET_TRANSFER_SUMMARY, SET_STEP } from "./action-types";

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
