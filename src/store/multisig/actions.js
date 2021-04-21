import {
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTIONS_SUCCESS,
  GET_MULTISIG_TRANSACTIONS_ERROR,
  GET_MULTISIG_TRANSACTION_BY_ID,
  GET_MULTISIG_TRANSACTION_BY_ID_SUCCESS,
  GET_MULTISIG_TRANSACTION_BY_ID_ERROR,
  SUBMIT_MULTISIG_TRANSACTION,
  SUBMIT_MULTISIG_TRANSACTION_SUCCESS,
  SUBMIT_MULTISIG_TRANSACTION_ERROR,
  CONFIRM_MULTISIG_TRANSACTION,
  CONFIRM_MULTISIG_TRANSACTION_SUCCESS,
  CONFIRM_MULTISIG_TRANSACTION_ERROR,
  CLEAR_MULTISIG_TRANSACTION,
} from "./action-types";

export function getMultisigTransactions(safeAddress) {
  return {
    type: GET_MULTISIG_TRANSACTIONS,
    safeAddress,
  };
}

export function getMultisigTransactionsSuccess(transactions) {
  return {
    type: GET_MULTISIG_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

export function getMultisigTransactionsError(error) {
  return {
    type: GET_MULTISIG_TRANSACTIONS_ERROR,
    error,
  };
}

export function getMultisigTransactionById(safeAddress, transactionId) {
  return {
    type: GET_MULTISIG_TRANSACTION_BY_ID,
    safeAddress,
    transactionId,
  };
}

export function getMultisigTransactionByIdSuccess(
  transactionDetails,
  executionAllowed
) {
  return {
    type: GET_MULTISIG_TRANSACTION_BY_ID_SUCCESS,
    transactionDetails,
    executionAllowed,
  };
}

export function getMultisigTransactionByIdError(error) {
  return {
    type: GET_MULTISIG_TRANSACTION_BY_ID_ERROR,
    error,
  };
}

export function createMultisigTransaction(body) {
  return {
    type: CREATE_MULTISIG_TRANSACTION,
    body,
  };
}

export function createMultisigTransactionSuccess(transactionId, log) {
  return {
    type: CREATE_MULTISIG_TRANSACTION_SUCCESS,
    transactionId,
    log,
  };
}

export function createMultisigTransactionError(error) {
  return {
    type: CREATE_MULTISIG_TRANSACTION_ERROR,
    error,
  };
}

export function confirmMultisigTransaction(body) {
  return {
    type: CONFIRM_MULTISIG_TRANSACTION,
    body,
  };
}

export function confirmMultisigTransactionSuccess(transactionId, log) {
  return {
    type: CONFIRM_MULTISIG_TRANSACTION_SUCCESS,
    transactionId,
    log,
  };
}

export function confirmMultisigTransactionError(error) {
  return {
    type: CONFIRM_MULTISIG_TRANSACTION_ERROR,
    error,
  };
}

export function submitMultisigTransaction(body) {
  return {
    type: SUBMIT_MULTISIG_TRANSACTION,
    body,
  };
}

export function submitMultisigTransactionSuccess(
  transactionHash,
  transactionId,
  log
) {
  return {
    type: SUBMIT_MULTISIG_TRANSACTION_SUCCESS,
    transactionHash,
    transactionId,
    log,
  };
}

export function submitMultisigTransactionError(error) {
  return {
    type: SUBMIT_MULTISIG_TRANSACTION_ERROR,
    error,
  };
}
export function clearMultisigTransactionHash() {
  return {
    type: CLEAR_MULTISIG_TRANSACTION,
  };
}
