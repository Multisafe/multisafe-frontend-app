import { call, fork, put, takeLatest } from "redux-saga/effects";
import jwt_decode from "jwt-decode";

import {
  ACCEPT_INVITATION,
  APPROVE_INVITATION,
  CREATE_INVITATION,
  GET_INVITATIONS,
} from "./action-types";
import {
  getInvitationsSuccess,
  getInvitationsError,
  createInvitationSuccess,
  createInvitationError,
  acceptInvitationSuccess,
  acceptInvitationError,
  approveInvitationSuccess,
  approveInvitationError,
} from "./actions";
import request from "utils/request";
import {
  createInvitationsEndpoint,
  getInvitationsEndpoint,
  acceptInvitationsEndpoint,
  approveInvitationsEndpoint,
} from "constants/endpoints";

export function* getInvitations(action) {
  const requestURL = `${getInvitationsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getInvitationsError(result.log));
    } else {
      yield put(
        getInvitationsSuccess(
          result.owners,
          result.safeOwner,
          result.setupCompleted
        )
      );
    }
  } catch (err) {
    yield put(getInvitationsError(err));
  }
}

export function* createInvitation(action) {
  const requestURL = `${createInvitationsEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(createInvitationError(result.log));
    } else {
      yield put(createInvitationSuccess(result.invitationLink, result.log));
    }
  } catch (err) {
    yield put(createInvitationError(err));
  }
}

export function* acceptInvitation(action) {
  let decoded;
  try {
    decoded = jwt_decode(action.invitationToken);
  } catch (err) {
    yield put(acceptInvitationError(`Invalid invitation token.`));
    return;
  }

  if (decoded.toAddress !== action.account) {
    yield put(
      acceptInvitationError(
        `Invalid address. This invite was meant for the address: ${decoded.toAddress}.`
      )
    );
    return;
  }

  const requestURL = `${acceptInvitationsEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      publicKey: action.publicKey,
      invitationId: decoded.invitationId,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${action.invitationToken}`,
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(acceptInvitationError(result.log));
    } else {
      yield put(acceptInvitationSuccess(result.log));
    }
  } catch (err) {
    yield put(acceptInvitationError(err));
  }
}

export function* approveInvitation(action) {
  const requestURL = `${approveInvitationsEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      encryptionKeyData: action.encryptionKeyData,
      invitationId: action.invitationId,
      safeAddress: action.safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(approveInvitationError(result.log));
    } else {
      yield put(approveInvitationSuccess(result.log));
    }
  } catch (err) {
    yield put(approveInvitationError(err));
  }
}

function* watchGetInvitations() {
  yield takeLatest(GET_INVITATIONS, getInvitations);
}

function* watchCreateInvitation() {
  yield takeLatest(CREATE_INVITATION, createInvitation);
}

function* watchAcceptInvitation() {
  yield takeLatest(ACCEPT_INVITATION, acceptInvitation);
}

function* watchApproveInvitation() {
  yield takeLatest(APPROVE_INVITATION, approveInvitation);
}

export default function* invitation() {
  yield fork(watchGetInvitations);
  yield fork(watchCreateInvitation);
  yield fork(watchAcceptInvitation);
  yield fork(watchApproveInvitation);
}
