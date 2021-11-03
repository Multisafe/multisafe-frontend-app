import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectNewTransfer = (state) => state.newTransfer || initialState;

const makeSelectTransferSummary = () =>
  createSelector(
    selectNewTransfer,
    (newTransferState) => newTransferState.summary
  );

const makeSelectStep = () =>
  createSelector(
    selectNewTransfer,
    (newTransferState) => newTransferState.step
  );

export { makeSelectTransferSummary, makeSelectStep };
