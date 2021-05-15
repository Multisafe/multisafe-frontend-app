import { call, put, fork, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";
import { hide } from "redux-modal";

import {
  CONFIRM_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION,
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTION_BY_ID,
  SUBMIT_MULTISIG_TRANSACTION,
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
  getMultisigTransactionByIdError,
  getMultisigTransactionByIdSuccess,
} from "./actions";
import request from "utils/request";
import {
  createMultisigTransactionEndpoint,
  getMultisigTransactionEndpoint,
  confirmMultisigTransactionEndpoint,
  submitMultisigTransactionEndpoint,
  getMultisigTransactionByIdEndpoint,
} from "constants/endpoints";
import { MODAL_NAME as MASS_PAYOUT_MODAL } from "components/Payments/MassPayoutModal";
import { MODAL_NAME as QUICK_TRANSFER_MODAL } from "components/Payments/QuickTransferModal";
import { MODAL_NAME as NEW_SPENDING_LIMIT_MODAL } from "components/SpendingLimits/NewSpendingLimitModal";
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
    yield put(
      getMultisigTransactionsSuccess(result.transactions, result.count)
    );
  } catch (err) {
    yield put(getMultisigTransactionsError(err));
  }
}

function* getMultisigTransactionById(action) {
  const requestURL = `${getMultisigTransactionByIdEndpoint}?safeAddress=${action.safeAddress}&transactionId=${action.transactionId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);

    if (result.flag === 400) {
      yield put(push("/dashboard/404")); // not found
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
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      createMultisigTransactionSuccess(result.transactionId, result.log)
    );
    yield put(
      push(
        routeGenerators.dashboard.transactionById({
          transactionId: result.transactionId,
        })
      )
    );
    yield put(hide(MASS_PAYOUT_MODAL));
    yield put(hide(QUICK_TRANSFER_MODAL));
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
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      confirmMultisigTransactionSuccess(result.transactionId, result.log)
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
    headers: {
      "content-type": "application/json",
    },
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

function* watchGetMultisigTransactions() {
  yield takeLatest(GET_MULTISIG_TRANSACTIONS, getMultisigTransactions);
}

function* watchGetMultisigTransactionById() {
  yield takeLatest(GET_MULTISIG_TRANSACTION_BY_ID, getMultisigTransactionById);
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

export default function* multisig() {
  yield fork(watchGetMultisigTransactions);
  yield fork(watchGetMultisigTransactionById);
  yield fork(watchCreateMultisigTransaction);
  yield fork(watchConfirmMultisigTransaction);
  yield fork(watchSubmitMultisigTransaction);
}
