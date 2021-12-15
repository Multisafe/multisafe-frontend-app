import { call, put, fork, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";
import { hide } from "redux-modal";

import {
  CONFIRM_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION,
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTION_BY_ID,
  SUBMIT_MULTISIG_TRANSACTION,
  GET_LABELS,
  CREATE_OR_UPDATE_LABEL,
  CREATE_TRANSACTION_LABELS,
  UPDATE_TRANSACTION_LABELS,
  CREATE_OR_UPDATE_TRANSACTION_NOTE,
} from "./action-types";
import {
  getMultisigTransactionsSuccess,
  getMultisigTransactionsError,
  createMultisigTransactionSuccess,
  createMultisigTransactionError,
  confirmMultisigTransactionSuccess,
  confirmMultisigTransactionError,
  submitMultisigTransactionSuccess,
  submitMultisigTransactionError,
  getMultisigTransactionById,
  getMultisigTransactionByIdError,
  getMultisigTransactionByIdSuccess,
  getLabels as getLabelsAction,
  getLabelsError,
  getLabelsSuccess,
  updateTransactionLabelsData,
  updateTransactionNoteData,
} from "./actions";
import request from "utils/request";
import {
  createMultisigTransactionEndpoint,
  getMultisigTransactionEndpoint,
  confirmMultisigTransactionEndpoint,
  submitMultisigTransactionEndpoint,
  getMultisigTransactionByIdEndpoint,
  getLabelsEndpoint,
  createLabelEndpoint,
  updateLabelEndpoint,
  createTransactionLabelEndpoint,
  updateTransactionLabelEndpoint,
  updateTransactionNoteEndpoint,
  createTransactionNoteEndpoint,
} from "constants/endpoints";
import { MODAL_NAME as NEW_SPENDING_LIMIT_MODAL } from "components/SpendingLimits/NewSpendingLimitModal";
import { MODAL_NAME as NEW_TRANSFER_MODAL } from "components/NewTransfer/NewTransferModal";
import { routeGenerators } from "constants/routes/generators";

function* getMultisigTransactions({ safeAddress, offset, limit }) {
  // const requestURL = `${getMultisigTransactionEndpoint}?safeAddress=${action.safeAddress}&offset=0&limit=100`;
  const requestURL = new URL(getMultisigTransactionEndpoint);
  const params = [
    ["safeAddress", safeAddress],
    ["offset", offset],
    ["limit", limit],
  ];
  requestURL.search = new URLSearchParams(params).toString();
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 400) {
      yield put(getMultisigTransactionsSuccess([], 0));
    } else {
      yield put(
        getMultisigTransactionsSuccess(
          result.transactions,
          result.count,
          result.isPendingTransactions
        )
      );
    }
  } catch (err) {
    yield put(getMultisigTransactionsError(err));
  }
}

function* fetchMultisigTransactionById(action) {
  const requestURL = `${getMultisigTransactionByIdEndpoint}?safeAddress=${action.safeAddress}&transactionId=${action.transactionId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);

    if (result.flag === 400) {
      yield put(
        push(
          routeGenerators.dashboard.root({
            safeAddress: action.safeAddress,
          })
        )
      ); // not found
    } else {
      yield put(
        getMultisigTransactionByIdSuccess(
          result.transaction,
          result.executionAllowed
        )
      );
    }
  } catch (err) {
    yield put(getMultisigTransactionByIdError(err));
  }
}

function* createMultisigTransaction(action) {
  const requestURL = `${createMultisigTransactionEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      createMultisigTransactionSuccess(result.transactionId, result.log)
    );
    yield put(
      push(
        routeGenerators.dashboard.transactionById({
          safeAddress: action.body.safeAddress,
          transactionId: result.transactionId,
        })
      )
    );
    yield put(hide(NEW_TRANSFER_MODAL));
    yield put(hide(NEW_SPENDING_LIMIT_MODAL));
  } catch (err) {
    yield put(createMultisigTransactionError(err));
  }
}

function* confirmMultisigTransaction(action) {
  const requestURL = `${confirmMultisigTransactionEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      confirmMultisigTransactionSuccess(result.transactionId, result.log)
    );
    yield put(
      getMultisigTransactionById(
        action.body.safeAddress,
        action.body.transactionId
      )
    );
  } catch (err) {
    yield put(confirmMultisigTransactionError(err));
  }
}

function* submitMultisigTransaction(action) {
  const requestURL = `${submitMultisigTransactionEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      submitMultisigTransactionSuccess(
        result.transactionHash,
        result.transactionId,
        result.log
      )
    );
  } catch (err) {
    yield put(submitMultisigTransactionError(err));
  }
}

function* getLabels(action) {
  const urlParams = new URLSearchParams({
    networkId: action.networkId,
    safeAddress: action.safeAddress,
    userAddress: action.userAddress,
    onlyActive: 0,
  });
  const requestUrl = `${getLabelsEndpoint}?${urlParams.toString()}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestUrl, options);
    if (result.flag !== 200) {
      yield put(getLabelsError(result.log));
    } else {
      yield put(getLabelsSuccess(result.data));
    }
  } catch (err) {
    yield put(getLabelsError(err));
  }
}

function* createOrUpdateLabel(action) {
  const requestUrl = action.create ? createLabelEndpoint : updateLabelEndpoint;

  const body = {
    safeAddress: action.safeAddress,
    [action.create ? "createdBy" : "updatedBy"]: action.userAddress,
    labels: [action.label],
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
  };

  try {
    const result = yield call(request, requestUrl, options);
    if (result.flag !== 200) {
      action.onError();
    } else {
      yield put(
        getLabelsAction(
          action.networkId,
          action.safeAddress,
          action.userAddress
        )
      );
      action.onSuccess(result.data);
    }
  } catch (err) {
    action.onError();
  }
}

function* updateTransactionLabels(action) {
  const requestUrl = updateTransactionLabelEndpoint;

  const body = {
    transactionId: action.transactionId,
    labels: action.labels,
    updatedBy: action.userAddress,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
  };

  try {
    const result = yield call(request, requestUrl, options);
    if (result.flag !== 200) {
      action.onError();
    } else {
      yield put(
        updateTransactionLabelsData({
          labels: action.labels,
          transactionId: action.transactionId,
        })
      );
      action.onSuccess();
    }
  } catch (err) {
    action.onError();
  }
}

function* createTransactionLabels(action) {
  const requestUrl = createTransactionLabelEndpoint;

  const body = {
    transactionHash: action.transactionHash,
    safeAddress: action.safeAddress,
    origin: action.origin,
    labels: action.labels,
    createdBy: action.userAddress,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
  };

  try {
    const result = yield call(request, requestUrl, options);
    if (result.flag !== 200) {
      action.onError();
    } else {
      yield put(
        updateTransactionLabelsData({
          labels: action.labels,
          transactionHash: action.transactionHash,
          transactionId: result.transactionId,
        })
      );
      action.onSuccess();
    }
  } catch (err) {
    action.onError();
  }
}

function* createOrUpdateTransactionNote(action) {
  const endpoint = action.transactionId
    ? updateTransactionNoteEndpoint
    : createTransactionNoteEndpoint;

  try {
    const result = yield call(request, endpoint, {
      method: "POST",
      body: JSON.stringify(action.body),
    });
    if (result.flag !== 200) {
      action.onError();
    } else {
      yield put(
        updateTransactionNoteData(
          action.transactionId || result.transactionId,
          action.transactionHash,
          action.note
        )
      );
      action.onSuccess();
    }
  } catch (err) {
    action.onError();
  }
}

function* watchGetMultisigTransactions() {
  yield takeLatest(GET_MULTISIG_TRANSACTIONS, getMultisigTransactions);
}

function* watchGetMultisigTransactionById() {
  yield takeLatest(
    GET_MULTISIG_TRANSACTION_BY_ID,
    fetchMultisigTransactionById
  );
}

function* watchGetLabels() {
  yield takeLatest(GET_LABELS, getLabels);
}

function* watchCreateOrUpdateLabel() {
  yield takeLatest(CREATE_OR_UPDATE_LABEL, createOrUpdateLabel);
}

function* watchCreateMultisigTransaction() {
  yield takeLatest(CREATE_MULTISIG_TRANSACTION, createMultisigTransaction);
}

function* watchConfirmMultisigTransaction() {
  yield takeLatest(CONFIRM_MULTISIG_TRANSACTION, confirmMultisigTransaction);
}

function* watchSubmitMultisigTransaction() {
  yield takeLatest(SUBMIT_MULTISIG_TRANSACTION, submitMultisigTransaction);
}

function* watchUpdateTransactionLabels() {
  yield takeLatest(UPDATE_TRANSACTION_LABELS, updateTransactionLabels);
}

function* watchCreateTransactionLabels() {
  yield takeLatest(CREATE_TRANSACTION_LABELS, createTransactionLabels);
}

function* watchCreateOrUpdateTransactionNote() {
  yield takeLatest(
    CREATE_OR_UPDATE_TRANSACTION_NOTE,
    createOrUpdateTransactionNote
  );
}

export default function* multisig() {
  yield fork(watchGetMultisigTransactions);
  yield fork(watchGetMultisigTransactionById);
  yield fork(watchCreateMultisigTransaction);
  yield fork(watchConfirmMultisigTransaction);
  yield fork(watchSubmitMultisigTransaction);
  yield fork(watchGetLabels);
  yield fork(watchCreateOrUpdateLabel);
  yield fork(watchUpdateTransactionLabels);
  yield fork(watchCreateTransactionLabels);
  yield fork(watchCreateOrUpdateTransactionNote);
}
