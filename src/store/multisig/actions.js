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
  CREATE_OR_UPDATE_TRANSACTION_NOTE,
  UPDATE_TRANSACTION_NOTE_DATA,
  GET_LABELS,
  GET_LABELS_ERROR,
  GET_LABELS_SUCCESS,
  CREATE_OR_UPDATE_LABEL,
  CREATE_TRANSACTION_LABELS,
  UPDATE_TRANSACTION_LABELS,
  UPDATE_TRANSACTION_LABELS_DATA,
} from "./action-types";

export function getMultisigTransactions(safeAddress, offset, limit) {
  return {
    type: GET_MULTISIG_TRANSACTIONS,
    safeAddress,
    offset,
    limit,
  };
}

export function getMultisigTransactionsSuccess(
  transactions,
  count,
  isPendingTransactions
) {
  return {
    type: GET_MULTISIG_TRANSACTIONS_SUCCESS,
    transactions,
    count,
    isPendingTransactions,
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

export function createOrUpdateTransactionNote(
  transactionId,
  transactionHash,
  note,
  body,
  onError,
  onSuccess
) {
  return {
    type: CREATE_OR_UPDATE_TRANSACTION_NOTE,
    transactionId,
    transactionHash,
    note,
    body,
    onError,
    onSuccess,
  };
}

export function updateTransactionNoteData(
  transactionId,
  transactionHash,
  note
) {
  return {
    type: UPDATE_TRANSACTION_NOTE_DATA,
    transactionId,
    transactionHash,
    note,
  };
}

export function clearMultisigTransactionHash() {
  return {
    type: CLEAR_MULTISIG_TRANSACTION,
  };
}

export function getLabels(networkId, safeAddress, userAddress) {
  return {
    type: GET_LABELS,
    networkId,
    safeAddress,
    userAddress,
  };
}

export function getLabelsSuccess(labels) {
  return {
    type: GET_LABELS_SUCCESS,
    labels,
  };
}

export function getLabelsError(error) {
  return {
    type: GET_LABELS_ERROR,
    error,
  };
}

export function createOrUpdateLabel(
  networkId,
  safeAddress,
  userAddress,
  label,
  create,
  onError,
  onSuccess
) {
  return {
    type: CREATE_OR_UPDATE_LABEL,
    networkId,
    safeAddress,
    userAddress,
    label,
    create,
    onError,
    onSuccess,
  };
}

export function updateTransactionLabels({
  transactionId,
  userAddress,
  labels,
  onError,
  onSuccess,
}) {
  return {
    type: UPDATE_TRANSACTION_LABELS,
    transactionId,
    userAddress,
    labels,
    onError,
    onSuccess,
  };
}
export function createTransactionLabels({
  transactionHash,
  safeAddress,
  userAddress,
  origin,
  labels,
  onError,
  onSuccess,
}) {
  return {
    type: CREATE_TRANSACTION_LABELS,
    transactionHash,
    safeAddress,
    userAddress,
    origin,
    labels,
    onError,
    onSuccess,
  };
}

export function updateTransactionLabelsData({
  labels,
  transactionId,
  transactionHash,
}) {
  return {
    type: UPDATE_TRANSACTION_LABELS_DATA,
    labels,
    transactionId,
    transactionHash,
  };
}
