import React, { useEffect } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import ConnectedIcon from "assets/icons/navbar/connected.svg";
import { useActiveWeb3React } from "hooks";
import Img from "components/common/Img";
import { minifyAddress } from "components/common/Web3Utils";
import { ConnectedAccount, Nav } from "./styles";
import { toggleNotification } from "store/layout/actions";
import { makeSelectIsNotificationOpen } from "store/layout/selectors";
import notificationsSaga from "store/notifications/saga";
import notificationsReducer from "store/notifications/reducer";
import {
  getNotifications,
  updateNotificationStatus,
} from "store/notifications/actions";
import { makeSelectHasSeen } from "store/notifications/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import BellIcon from "assets/icons/navbar/bell.svg";

import { NotificationBell } from "./styles";
import NewTransferDropdown from "./NewTransferDropdown";
import CurrencyDropdown from "./CurrencyDropdown";

const notificationsKey = "notifications";

export default function Navbar({ isSidebarOpen, openSidebar }) {
  const { account } = useActiveWeb3React();

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const hasSeen = useSelector(makeSelectHasSeen());
  const isNotificationOpen = useSelector(makeSelectIsNotificationOpen());

  useInjectReducer({ key: notificationsKey, reducer: notificationsReducer });

  useInjectSaga({ key: notificationsKey, saga: notificationsSaga });

  useEffect(() => {
    if (ownerSafeAddress && account)
      dispatch(getNotifications(ownerSafeAddress, account));
  }, [dispatch, ownerSafeAddress, account]);

  const toggleNotifications = () => {
    if (isNotificationOpen) dispatch(toggleNotification(false));
    else {
      dispatch(toggleNotification(true));
      if (account && ownerSafeAddress && !hasSeen) {
        dispatch(updateNotificationStatus(ownerSafeAddress, account));
      }
    }
  };

  return (
    <Nav>
      <div className="nav-icon" onClick={openSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="nav-container">
        <ConnectedAccount>
          <Img src={ConnectedIcon} alt="connected" className="mr-2" />
          <div className="text">{minifyAddress(account)}</div>
        </ConnectedAccount>
        <NewTransferDropdown />
        <CurrencyDropdown />
        <NotificationBell onClick={toggleNotifications} hasSeen={hasSeen}>
          <Img src={BellIcon} className="bell" alt="bell" />
          {!hasSeen && <div className="prompt"></div>}
        </NotificationBell>
      </div>
    </Nav>
  );
}
