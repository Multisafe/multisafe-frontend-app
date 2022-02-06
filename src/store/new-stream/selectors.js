import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectNewStream = (state) => state.newStream || initialState;

const makeSelectStreamSummary = () =>
  createSelector(selectNewStream, (newStreamState) => newStreamState.summary);

const makeSelectFormData = () =>
  createSelector(selectNewStream, (newStreamState) => newStreamState.formData);

const makeSelectStep = () =>
  createSelector(selectNewStream, (newStreamState) => newStreamState.step);

export { makeSelectStreamSummary, makeSelectFormData, makeSelectStep };
