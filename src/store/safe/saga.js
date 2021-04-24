import { call, put, fork, takeLatest } from "redux-saga/effects";
import { hide } from "redux-modal";

import { GET_NONCE, UPDATE_OWNER_NAME } from "./action-types";
import {
  getNonceSuccess,
  getNonceError,
  updateOwnerNameSuccess,
  updateOwnerNameError,
} from "./actions";
import request from "utils/request";
import {
  gnosisSafeTransactionEndpoint,
  updateOwnerNameEndpoint,
} from "constants/endpoints";
import { MODAL_NAME as EDIT_OWNER_MODAL } from "components/InviteOwners/EditOwnerModal";
import { getInvitations } from "store/invitation/actions";

function* getTransactionNonce(action) {
  const requestURL = `${gnosisSafeTransactionEndpoint}${action.safeAddress}/transactions/?has_confirmations=True`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getNonceSuccess(result.count, result.countUniqueNonce));
  } catch (err) {
    yield put(getNonceError(err));
  }
}

function* updateOwnerName({ ownerAddress, name, safeAddress }) {
  const requestURL = `${updateOwnerNameEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify({
      ownerAddress,
      name,
      safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(updateOwnerNameSuccess(result.log));
    yield put(hide(EDIT_OWNER_MODAL));
    yield put(getInvitations(safeAddress));
  } catch (err) {
    yield put(updateOwnerNameError(err));
  }
}

function* watchGetNonce() {
  yield takeLatest(GET_NONCE, getTransactionNonce);
}

function* watchUpdateOwnerName() {
  yield takeLatest(UPDATE_OWNER_NAME, updateOwnerName);
}

export default function* safe() {
  yield fork(watchGetNonce);
  yield fork(watchUpdateOwnerName);
}
