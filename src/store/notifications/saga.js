import { takeLatest, put, call, fork } from "redux-saga/effects";
import { GET_NOTIFICATIONS, UPDATE_NOTIFICATION_STATUS } from "./action-types";
import {
  getNotificationsSuccess,
  getNotificationsError,
  updateNotificationStatusSuccess,
  updateNotificationStatusError,
} from "./actions";
import request from "utils/request";
import {
  updateNotificationsEndpoint,
  getNotificationsEndpoint,
} from "constants/endpoints";

function* updateNotification(action) {
  const requestURL = `${updateNotificationsEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      safeAddress: action.safeAddress,
      userAddress: action.userAddress,
    }),
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(updateNotificationStatusError(result.log));
    } else {
      yield put(
        updateNotificationStatusSuccess(
          result.notifications,
          result.hasSeen,
          result.log
        )
      );
    }
  } catch (err) {
    yield put(updateNotificationStatusError(err));
  }
}

function* fetchNotifications(action) {
  const requestURL = `${getNotificationsEndpoint}?safeAddress=${action.safeAddress}&userAddress=${action.userAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getNotificationsError(result.log));
    } else {
      yield put(
        getNotificationsSuccess(
          result.notifications,
          result.hasSeen,
          result.log
        )
      );
    }
  } catch (err) {
    yield put(getNotificationsError(err.message));
  }
}

function* watchGetNotifications() {
  yield takeLatest(GET_NOTIFICATIONS, fetchNotifications);
}

function* watchUpdateNotificationStatus() {
  yield takeLatest(UPDATE_NOTIFICATION_STATUS, updateNotification);
}

export default function* notifications() {
  yield fork(watchGetNotifications);
  yield fork(watchUpdateNotificationStatus);
}
