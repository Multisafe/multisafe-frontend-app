import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { startCase } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlug, faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import CopyButton from "components/common/Copy";
import SideNav from "components/SideNav";
import {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
} from "store/global/selectors";
import { minifyAddress } from "components/common/Web3Utils";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import { logoutUser } from "store/logout/actions";
import logoutSaga from "store/logout/saga";
import notificationsSaga from "store/notifications/saga";
import notificationsReducer from "store/notifications/reducer";
import { getNotifications } from "store/notifications/actions";
import {
  makeSelectNotifications,
  makeSelectHasSeen,
  makeSelectLoading,
} from "store/notifications/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import LogoutPng from "assets/icons/logout.png";
import SettingsPng from "assets/icons/settings.png";
import ParcelSvg from "assets/icons/parcel.svg";
import GreenDot from "assets/icons/notifications/green-dot.svg";
import { findNetworkNameByWeb3ChainId } from "constants/networks";
import Img from "components/common/Img";
import Loading from "components/common/Loading";

import {
  HeaderLink,
  NavBar,
  NavBarContent,
  NavGroup,
  AccountAddress,
  NetworkName,
  Circle,
  Profile,
  ProfileMenu,
  NotificationBell,
  Notifications,
} from "./styles";

const logoutKey = "logout";
const notificationsKey = "notifications";

export default function DashboardHeader() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const { account, chainId } = useActiveWeb3React();

  const [showNotifications, setShowNotifications] = useState(false);

  const ownerName = useSelector(makeSelectOwnerName());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const notifications = useSelector(makeSelectNotifications());
  const hasSeen = useSelector(makeSelectHasSeen());
  const loadingNotifications = useSelector(makeSelectLoading());

  const dispatch = useDispatch();

  useInjectReducer({ key: notificationsKey, reducer: notificationsReducer });

  useInjectSaga({ key: logoutKey, saga: logoutSaga });
  useInjectSaga({ key: notificationsKey, saga: notificationsSaga });

  useEffect(() => {
    if (ownerSafeAddress) dispatch(getNotifications(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  const toggleNotifications = () => {
    setShowNotifications((showNotifications) => !showNotifications);
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const getNetworkName = () => {
    return startCase(findNetworkNameByWeb3ChainId(chainId));
  };

  return (
    <div>
      <NavBar className="dashboard">
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <SideNav />
            <HeaderLink to="/dashboard" className="dashboard-link">
              <Img src={ParcelSvg} alt="parcel" width="160" />
            </HeaderLink>
          </div>
          <NavGroup>
            {chainId && (
              <NetworkName className="mr-3">
                <Circle>
                  <FontAwesomeIcon icon={faPlug} color="#fff" />
                </Circle>
                <div className="mx-3">
                  <div className="name">{getNetworkName()}</div>
                  <div className="info">Current Network</div>
                </div>
              </NetworkName>
            )}
            <AccountAddress>
              <p>{minifyAddress(ownerSafeAddress)}</p>
              <Circle className="ml-2">
                <CopyButton
                  id="address"
                  tooltip="safe address"
                  value={ownerSafeAddress}
                />
              </Circle>
            </AccountAddress>
            <ProfileMenu>
              <div className="dropdown ml-3">
                <Profile className="profile">
                  <div className="d-flex align-items-center">
                    <Circle>
                      {ownerName && ownerName.substring(0, 1).toUpperCase()}
                    </Circle>
                    <div className="mx-3">
                      <div className="name">{ownerName}</div>
                      <div className="info">Account Info</div>
                    </div>
                  </div>
                </Profile>
                <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-6">
                  <li className="flex-column">
                    <div className="option">Connected Account</div>
                    <div>{account && minifyAddress(account)}</div>
                  </li>
                  <Link to="/dashboard/invite">
                    <div className="option">Settings</div>
                    <div>
                      <Img src={SettingsPng} alt="settings" width="16" />
                    </div>
                  </Link>
                  <li onClick={logout}>
                    <div className="option">Logout</div>
                    <div>
                      <Img src={LogoutPng} alt="logout" width="16" />
                    </div>
                  </li>
                </ul>
              </div>
            </ProfileMenu>
            <NotificationBell onClick={toggleNotifications} hasSeen={hasSeen}>
              <Circle className="ml-2">
                <FontAwesomeIcon icon={faBell} color="#fff" className="bell" />
                {!hasSeen && <div className="prompt"></div>}
              </Circle>
            </NotificationBell>
            {showNotifications && (
              <Notifications>
                <div className="notifications-title">Notifications</div>

                {loadingNotifications && (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "250px" }}
                  >
                    <Loading color="primary" width="50px" height="50px" />
                  </div>
                )}
                {!loadingNotifications && notifications.length === 0 ? (
                  <div className="no-notifications">Nothing to see here...</div>
                ) : (
                  notifications.map(
                    ({
                      notificationId,
                      data,
                      type,
                      transactionId,
                      createdOn,
                    }) => (
                      <div className="notification" key={notificationId}>
                        <div className="dot">
                          <Img src={GreenDot} alt="green-dot" />
                        </div>
                        <div className="content">
                          <div className="notification-heading">
                            {data.headline}
                          </div>
                          <div className="notification-description">
                            {cryptoUtils.decryptDataUsingEncryptionKey(
                              data.name,
                              encryptionKey,
                              organisationType
                            )}{" "}
                            {data.message}
                          </div>
                        </div>
                        <Link to={`/dashboard/transactions/${transactionId}`}>
                          <div
                            className="notification-view"
                            onClick={toggleNotifications}
                          >
                            View
                          </div>
                        </Link>
                      </div>
                    )
                  )
                )}
              </Notifications>
            )}
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
