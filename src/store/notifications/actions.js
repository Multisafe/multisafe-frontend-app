import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_ERROR,
  UPDATE_NOTIFICATION_STATUS,
  UPDATE_NOTIFICATION_STATUS_SUCCESS,
  UPDATE_NOTIFICATION_STATUS_ERROR,
  OPEN_NOTIFICATIONS,
  CLOSE_NOTIFICATIONS,
} from "./action-types";

export function getNotifications(safeAddress, userAddress) {
  return {
    type: GET_NOTIFICATIONS,
    safeAddress,
    userAddress,
  };
}

export function getNotificationsSuccess(notifications, hasSeen, log) {
  return {
    type: GET_NOTIFICATIONS_SUCCESS,
    notifications,
    hasSeen,
    log,
  };
}

export function getNotificationsError(error) {
  return {
    type: GET_NOTIFICATIONS_ERROR,
    error,
  };
}

export function updateNotificationStatus(safeAddress, userAddress) {
  return {
    type: UPDATE_NOTIFICATION_STATUS,
    safeAddress,
    userAddress,
  };
}

export function updateNotificationStatusSuccess(notifications, hasSeen, log) {
  return {
    type: UPDATE_NOTIFICATION_STATUS_SUCCESS,
    notifications,
    hasSeen,
    log,
  };
}

export function updateNotificationStatusError(error) {
  return {
    type: UPDATE_NOTIFICATION_STATUS_ERROR,
    error,
  };
}

export function openNotifications() {
  return {
    type: OPEN_NOTIFICATIONS,
  };
}
export function closeNotifications() {
  return {
    type: CLOSE_NOTIFICATIONS,
  };
}
