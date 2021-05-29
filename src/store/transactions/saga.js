import { takeLatest, put, call, fork } from "redux-saga/effects";
import {
  ADD_TRANSACTION,
  GET_TRANSACTION_BY_ID,
  VIEW_TRANSACTIONS,
} from "./action-types";
import {
  addTransactionSuccess,
  addTransactionError,
  viewTransactionsSuccess,
  viewTransactionsError,
  getTransactionByIdSuccess,
  getTransactionByIdError,
} from "./actions";
import request from "utils/request";
import {
  createTransactionEndpoint,
  getTransactionsEndpoint,
  getTransactionByIdEndpoint,
} from "constants/endpoints";

function* addTransaction({ body }) {
  const requestURL = `${createTransactionEndpoint}`;
  const {
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
  } = body;
  const options = {
    method: "POST",
    body: JSON.stringify({
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
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addTransactionError(result.log));
    } else {
      yield put(
        addTransactionSuccess(
          result.transactionHash,
          result.transactionId,
          result.log
        )
      );
    }
  } catch (err) {
    yield put(addTransactionError("Could not create transaction."));
  }
}

function* getTransactions({ safeAddress, offset, limit }) {
  // const requestURL = `${getTransactionsEndpoint}?safeAddress=${action.safeAddress}&offset=0&limit=2`;
  const requestURL = new URL(getTransactionsEndpoint);
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
      yield put(viewTransactionsSuccess([], 0));
    } else {
      yield put(viewTransactionsSuccess(result.transactions, result.count));
    }
  } catch (err) {
    yield put(viewTransactionsError(err));
  }
}

function* getTransactionById(action) {
  const requestURL = `${getTransactionByIdEndpoint}?safeAddress=${action.safeAddress}&transactionId=${action.transactionId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getTransactionByIdError(result.log));
    } else {
      yield put(getTransactionByIdSuccess(result.transaction, result.log));
    }
  } catch (err) {
    yield put(getTransactionByIdError(err));
  }
}

function* watchAddTransaction() {
  yield takeLatest(ADD_TRANSACTION, addTransaction);
}

function* watchGetTransactions() {
  yield takeLatest(VIEW_TRANSACTIONS, getTransactions);
}

function* watchGetTransactionById() {
  yield takeLatest(GET_TRANSACTION_BY_ID, getTransactionById);
}
export default function* transactions() {
  yield fork(watchAddTransaction);
  yield fork(watchGetTransactions);
  yield fork(watchGetTransactionById);
}
