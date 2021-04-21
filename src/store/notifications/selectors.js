/**
 * The notifications state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectNotifications = (state) => state.notifications || initialState;

const makeSelectNotifications = () =>
  createSelector(
    selectNotifications,
    (notificationsState) => notificationsState.notifications
  );

const makeSelectHasSeen = () =>
  createSelector(
    selectNotifications,
    (notificationsState) =>
      notificationsState.hasSeen ||
      (notificationsState.notifications &&
        notificationsState.notifications.length === 0)
  );

const makeSelectLoading = () =>
  createSelector(
    selectNotifications,
    (notificationsState) => notificationsState.loading
  );

const makeSelectUpdating = () =>
  createSelector(
    selectNotifications,
    (notificationsState) => notificationsState.updating
  );

const makeSelectError = () =>
  createSelector(
    selectNotifications,
    (notificationsState) => notificationsState.error
  );

const makeSelectShowNotifications = () =>
  createSelector(
    selectNotifications,
    (notificationsState) => notificationsState.show
  );

export {
  selectNotifications,
  makeSelectHasSeen,
  makeSelectNotifications,
  makeSelectShowNotifications,
  makeSelectLoading,
  makeSelectUpdating,
  makeSelectError,
};
