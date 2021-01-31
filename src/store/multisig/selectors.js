import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectMultisig = (state) => state.multisig || initialState;

const makeSelectFetching = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.fetching);

const makeSelectMultisigTransactions = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.transactions);

const makeSelectMultisigTransactionDetails = () =>
  createSelector(
    selectMultisig,
    (multisigState) => multisigState.transactionDetails
  );

const makeSelectSuccess = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.success);

const makeSelectMultisigTransactionHash = () =>
  createSelector(
    selectMultisig,
    (multisigState) => multisigState.transactionHash
  );

const makeSelectUpdating = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.updating);

const makeSelectConfirmed = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.confirmed);

const makeSelectError = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.error);

export {
  selectMultisig,
  makeSelectMultisigTransactions,
  makeSelectMultisigTransactionDetails,
  makeSelectFetching,
  makeSelectMultisigTransactionHash,
  makeSelectSuccess,
  makeSelectUpdating,
  makeSelectConfirmed,
  makeSelectError,
};
