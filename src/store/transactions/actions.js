import { TRANSACTION_MODES } from "constants/transactions";
import {
  ADD_TRANSACTION,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_ERROR,
  VIEW_TRANSACTIONS,
  VIEW_TRANSACTIONS_SUCCESS,
  VIEW_TRANSACTIONS_ERROR,
  GET_TRANSACTION_BY_ID,
  GET_TRANSACTION_BY_ID_SUCCESS,
  GET_TRANSACTION_BY_ID_ERROR,
  CLEAR_TRANSACTION_HASH,
} from "./action-types";

export function addTransaction({
  to,
  safeAddress,
  createdBy,
  transactionHash,
  txData,
  tokenValue,
  tokenCurrency,
  fiatValue,
  addresses,
  fiatCurrency = "USD",
  transactionMode = TRANSACTION_MODES.MASS_PAYOUT,
  ...rest
}) {
  return {
    type: ADD_TRANSACTION,
    body: {
      to,
      safeAddress,
      createdBy,
      transactionHash,
      txData,
      tokenValue,
      tokenCurrency,
      fiatValue,
      addresses,
      fiatCurrency,
      transactionMode,
      ...rest,
    },
  };
}

export function addTransactionSuccess(metaTransactionHash, transactionId, log) {
  return {
    type: ADD_TRANSACTION_SUCCESS,
    log,
    metaTransactionHash,
    transactionId,
  };
}

export function addTransactionError(error) {
  return {
    type: ADD_TRANSACTION_ERROR,
    error,
  };
}

export function viewTransactions(safeAddress, offset = 0, limit = 5) {
  return {
    type: VIEW_TRANSACTIONS,
    safeAddress,
    offset,
    limit,
  };
}

export function viewTransactionsSuccess(transactions, count) {
  return {
    type: VIEW_TRANSACTIONS_SUCCESS,
    transactions,
    count,
  };
}

export function viewTransactionsError(error) {
  return {
    type: VIEW_TRANSACTIONS_ERROR,
    error,
  };
}

export function getTransactionById(safeAddress, transactionId) {
  return {
    type: GET_TRANSACTION_BY_ID,
    safeAddress,
    transactionId,
  };
}

export function getTransactionByIdSuccess(transactionDetails, log) {
  return {
    type: GET_TRANSACTION_BY_ID_SUCCESS,
    transactionDetails,
    log,
  };
}

export function getTransactionByIdError(error) {
  return {
    type: GET_TRANSACTION_BY_ID_ERROR,
    error,
  };
}

export function clearTransactionHash() {
  return {
    type: CLEAR_TRANSACTION_HASH,
  };
}
