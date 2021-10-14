import produce from "immer";
import {
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTIONS_SUCCESS,
  GET_MULTISIG_TRANSACTIONS_ERROR,
  GET_MULTISIG_TRANSACTION_BY_ID,
  GET_MULTISIG_TRANSACTION_BY_ID_SUCCESS,
  GET_MULTISIG_TRANSACTION_BY_ID_ERROR,
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
  SUBMIT_MULTISIG_TRANSACTION,
  SUBMIT_MULTISIG_TRANSACTION_SUCCESS,
  SUBMIT_MULTISIG_TRANSACTION_ERROR,
  CONFIRM_MULTISIG_TRANSACTION,
  CONFIRM_MULTISIG_TRANSACTION_SUCCESS,
  CONFIRM_MULTISIG_TRANSACTION_ERROR,
  CLEAR_MULTISIG_TRANSACTION,
  UPDATE_MULTISIG_TRANSACTION_NOTE,
} from "./action-types";

export const initialState = {
  fetching: false,
  updating: false,
  transactions: [],
  transactionDetails: null, // tx by id
  transactionId: "",
  log: "",
  error: false,
  success: false,
  confirmed: false,
  transactionHash: "",
  executionAllowed: false,
  transactionCount: 1,
  isPendingTransactions: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_MULTISIG_TRANSACTIONS:
        draft.fetching = true;
        draft.error = false;
        if (action.offset === 0) draft.transactions = [];
        break;

      case GET_MULTISIG_TRANSACTIONS_SUCCESS:
        draft.fetching = false;
        draft.transactions = [...state.transactions, ...action.transactions];
        draft.transactionCount = action.count;
        draft.isPendingTransactions = action.isPendingTransactions
          ? true
          : false;
        break;

      case GET_MULTISIG_TRANSACTIONS_ERROR:
        draft.fetching = false;
        draft.error = action.error;
        draft.transactions = [];
        break;

      case GET_MULTISIG_TRANSACTION_BY_ID:
        draft.fetching = true;
        draft.error = false;
        break;

      case GET_MULTISIG_TRANSACTION_BY_ID_SUCCESS:
        draft.fetching = false;
        draft.transactionDetails = action.transactionDetails;
        draft.executionAllowed = action.executionAllowed;
        break;

      case GET_MULTISIG_TRANSACTION_BY_ID_ERROR:
        draft.fetching = false;
        draft.error = action.error;
        break;

      case CREATE_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        break;

      case CREATE_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.success = true;
        break;

      case CREATE_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        draft.success = false;
        break;

      case CONFIRM_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.confirmed = false;
        draft.error = false;
        break;

      case CONFIRM_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.confirmed = true;
        break;

      case CONFIRM_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        draft.confirmed = false;
        break;

      case SUBMIT_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        draft.transactionId = "";
        break;

      case SUBMIT_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.transactionHash = action.transactionHash;
        draft.transactionId = action.transactionId;
        draft.success = true;
        break;

      case SUBMIT_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        draft.success = false;
        draft.transactionId = "";
        break;

      case UPDATE_MULTISIG_TRANSACTION_NOTE:
        const { transactionId, transactionHash, note } = action;

        const index = state.transactions.findIndex(
          ({ txDetails }) =>
            (!!transactionId && transactionId === txDetails.transactionId) ||
            (!!transactionHash && transactionHash === txDetails.transactionHash)
        );

        draft.transactions = state.transactions;
        draft.transactions[index].txDetails.notes = note;
        draft.transactions[index].txDetails.transactionId = transactionId;

        if (
          state.transactionDetails?.txDetails?.transactionId === transactionId
        ) {
          draft.transactionDetails.txDetails.notes = note;
        }

        break;

      case CLEAR_MULTISIG_TRANSACTION:
        draft.transactionHash = "";
        break;
    }
  });

export default reducer;
