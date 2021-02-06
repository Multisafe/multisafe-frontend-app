/**
 * The tokens state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectTokens = (state) => state.tokens || initialState;

const makeSelectTokens = () =>
  createSelector(selectTokens, (tokensState) => tokensState.tokens);

const makeSelectTokenList = () =>
  createSelector(selectTokens, (tokensState) => tokensState.tokenList);

const makeSelectSuccess = () =>
  createSelector(selectTokens, (tokensState) => tokensState.success);

const makeSelectLoading = () =>
  createSelector(selectTokens, (tokensState) => tokensState.loading);

const makeSelectUpdating = () =>
  createSelector(selectTokens, (tokensState) => tokensState.updating);

const makeSelectPrices = () =>
  createSelector(selectTokens, (tokensState) => tokensState.prices);

const makeSelectError = () =>
  createSelector(selectTokens, (tokensState) => tokensState.error);

export {
  selectTokens,
  makeSelectTokens,
  makeSelectSuccess,
  makeSelectTokenList,
  makeSelectPrices,
  makeSelectLoading,
  makeSelectUpdating,
  makeSelectError,
};
