import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";
import formatDistance from "date-fns/formatDistance";

import { makeSelectOrganisationType } from "store/global/selectors";
import { useLocalStorage } from "hooks";
import notificationsSaga from "store/notifications/saga";
import notificationsReducer from "store/notifications/reducer";
import {
  makeSelectNotifications,
  makeSelectLoading,
} from "store/notifications/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import GreenDot from "assets/icons/notifications/green-dot.svg";
import RedDot from "assets/icons/notifications/red-dot.svg";
import YellowDot from "assets/icons/notifications/yellow-dot.svg";
import PurpleDot from "assets/icons/notifications/purple-dot.svg";
import Img from "components/common/Img";
import Loading from "components/common/Loading";
import CloseIcon from "assets/icons/navbar/close.svg";
import { makeSelectIsNotificationOpen } from "store/layout/selectors";
import { toggleNotification } from "store/layout/actions";

import { NotificationMenu } from "./styles";

const notificationsKey = "notifications";

const notificationStyles = {
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    top: "0",
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#fff",
  },
  bmItemList: {
    color: "#373737",
  },
  bmItem: {
    display: "flex",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.05)",
    top: "0",
  },
};

function NotificationSidebar() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const organisationType = useSelector(makeSelectOrganisationType());
  const notifications = useSelector(makeSelectNotifications());
  const loadingNotifications = useSelector(makeSelectLoading());
  const isNotificationOpen = useSelector(makeSelectIsNotificationOpen());

  const dispatch = useDispatch();

  useInjectReducer({ key: notificationsKey, reducer: notificationsReducer });

  useInjectSaga({ key: notificationsKey, saga: notificationsSaga });

  const handleStateChange = (state) => {
    dispatch(toggleNotification(state.isOpen));
  };

  const renderDotByStatus = (status) => {
    switch (status) {
      case 0: // created
        return <Img src={YellowDot} alt="yellow-dot" />;

      case 1: // approved
        return <Img src={PurpleDot} alt="purple-dot" />;

      case 2: // rejected
        return <Img src={RedDot} alt="red-dot" />;

      case 3: // submitted
        return <Img src={GreenDot} alt="red-dot" />;

      default:
        return <Img src={GreenDot} alt="green-dot" />;
    }
  };

  const closeNotifications = () => {
    dispatch(toggleNotification(false));
  };

  const renderNotification = ({
    notificationId,
    data,
    type,
    transactionId,
    createdOn,
  }) => {
    if (type === 0) {
      // Transaction
      return (
        <div className="notification" key={notificationId}>
          <div className="d-flex">
            <div className="dot">{renderDotByStatus(data.status)}</div>
            <div className="content">
              <div className="notification-heading">{data.headline}</div>
              <div className="notification-description">
                {data.name &&
                  cryptoUtils.decryptDataUsingEncryptionKey(
                    data.name,
                    encryptionKey,
                    organisationType
                  )}{" "}
                {data.message}
              </div>
              <div className="notification-date">
                {formatDistance(new Date(), new Date(createdOn))} ago
              </div>
            </div>
          </div>
          <Link
            to={`/dashboard/transactions/${transactionId}`}
            className="notification-view"
          >
            <div onClick={closeNotifications}>View</div>
          </Link>
        </div>
      );
    } else if (type === 1) {
      // Incoming Transaction
      return (
        <div className="notification" key={notificationId}>
          <div className="dot">{renderDotByStatus(data.status)}</div>
          <div className="content">
            <div className="notification-heading">{data.headline}</div>
            <div className="notification-description">{data.message}</div>
            <div className="notification-date">
              {formatDistance(new Date(), new Date(createdOn))} ago
            </div>
          </div>
          <a
            href={data.etherscanUrl}
            target="_blank"
            rel="noreferrer noopenner"
          >
            <div className="notification-view" onClick={closeNotifications}>
              View
            </div>
          </a>
        </div>
      );
    }
  };

  return (
    <NotificationMenu
      styles={notificationStyles}
      right
      customBurgerIcon={false}
      customCrossIcon={false}
      disableAutoFocus
      isOpen={isNotificationOpen}
      onStateChange={(state) => handleStateChange(state)}
      width={380}
    >
      <div className="notifications-header">
        <div className="title">Recent Activity</div>
        <div className="close" onClick={closeNotifications}>
          <Img src={CloseIcon} alt="close" />
        </div>
      </div>

      {loadingNotifications && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "250px" }}
        >
          <Loading color="primary" width="50px" height="50px" />
        </div>
      )}
      {!loadingNotifications && notifications && notifications.length === 0 ? (
        <div className="no-notifications">Nothing to see here...</div>
      ) : (
        notifications &&
        notifications.map((notification) => renderNotification(notification))
      )}
    </NotificationMenu>
  );
}

export default memo(NotificationSidebar);
