import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";

import {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import Img from "components/common/Img";
import CoinshiftLogo from "assets/images/logo.svg";
import InviteIcon from "assets/icons/sidebar/invite-icon.svg";
import SettingsIcon from "assets/icons/sidebar/settings-icon.svg";
import SwapAccountIcon from "assets/icons/sidebar/swap-account-icon.svg";
import LogoutIcon from "assets/icons/sidebar/logout-icon.svg";
import { logoutUser } from "store/logout/actions";
import logoutSaga from "store/logout/saga";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { mainNavItems } from "./navItems";
import invitationSaga from "store/invitation/saga";
import invitationReducer from "store/invitation/reducer";
import { getInvitations } from "store/invitation/actions";
import { makeSelectIsSetupComplete } from "store/invitation/selectors";
import CopyButton from "components/common/Copy";
import BlockExplorerLink from "components/common/BlockExplorerLink";
import { EXPLORER_LINK_TYPES } from "components/common/Web3Utils";
import { useActiveWeb3React, useDropdown } from "hooks";
import { minifyAddress } from "components/common/Web3Utils";
import { routeGenerators } from "constants/routes/generators";
import InfoIcon from "assets/icons/dashboard/info-icon.svg";
import { toggleSwitchAccount } from "store/layout/actions";

import { DashboardSidebar } from "./styles";
import { useFeatureManagement } from "hooks/useFeatureManagement";

const logoutKey = "logout";
const invitationKey = "invitation";

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const location = useLocation();
  const { onboard } = useActiveWeb3React();
  const { open, toggleDropdown } = useDropdown();
  const { isFeatureEnabled } = useFeatureManagement();

  const dispatch = useDispatch();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });
  useInjectSaga({ key: logoutKey, saga: logoutSaga });

  const isSetupComplete = useSelector(makeSelectIsSetupComplete());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const ownerName = useSelector(makeSelectOwnerName());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

  const logout = () => {
    if (onboard) {
      onboard.walletReset();
    }
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (safeAddress) {
      dispatch(getInvitations(safeAddress));
    }
  }, [dispatch, safeAddress]);

  const openSwitchAccountSidebar = () => {
    dispatch(toggleSwitchAccount(true));
  };

  const renderNavItem = ({ link, href, name, icon, activeIcon, feature }) => {
    if (feature && !isFeatureEnabled(feature)) {
      return null;
    }

    if (link) {
      const active = location.pathname === link({ safeAddress });
      return (
        <Link
          key={name}
          to={link({ safeAddress })}
          className={`menu-item ${active && "menu-item-highlighted"}`}
          onClick={closeSidebar}
        >
          <div className="icon">
            <Img src={active ? activeIcon : icon} alt={name} />
          </div>
          <div className="name">{name}</div>
        </Link>
      );
    } else if (href) {
      return (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`menu-item`}
        >
          <div className="icon">
            <Img src={icon} alt={name} />
          </div>
          <div className="name">{name}</div>
        </a>
      );
    }
  };

  return (
    <DashboardSidebar className={`${isSidebarOpen && "sidebar-responsive"}`}>
      <div className="close-btn" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </div>
      <div className="logo">
        <Img src={CoinshiftLogo} alt="coinshift" width="140" />
      </div>

      <div className="settings-container">
        <div className="settings" onClick={toggleDropdown}>
          <div>
            <div className="company-title">{ownerName}</div>
            <div className="company-subtitle">{minifyAddress(safeAddress)}</div>
          </div>
          <div>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <div className={`settings-dropdown ${open && "show"}`}>
            <div className="settings-option column">
              <div className="name">Safe Address</div>
              <div className="name my-1">{safeAddress}</div>
              <div className="d-flex mt-2">
                <CopyButton
                  id="settings-address"
                  tooltip="address"
                  value={safeAddress || ""}
                  className="mr-3"
                  stopPropagation
                />
                <BlockExplorerLink
                  id="block-explorer-link"
                  type={EXPLORER_LINK_TYPES.ADDRESS}
                  address={safeAddress}
                />
              </div>
            </div>
            <Link
              to={routeGenerators.dashboard.settings({ safeAddress })}
              className="settings-option"
            >
              <div className="icon">
                <Img src={SettingsIcon} alt="settings" />
              </div>
              <div className="name">Settings</div>
            </Link>
            {!isReadOnly && (
              <div
                className="settings-option"
                onClick={openSwitchAccountSidebar}
              >
                <div className="icon">
                  <Img src={SwapAccountIcon} alt="switch-account" />
                </div>
                <div className="name">Switch Account</div>
              </div>
            )}
            {!isReadOnly && (
              <div className="settings-option" onClick={logout}>
                <div className="icon">
                  <Img src={LogoutIcon} alt="logout" />
                </div>
                <div className="name">Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="menu-items">
        {mainNavItems.map((navItem) => renderNavItem(navItem))}
        {isReadOnly && (
          <div className="read-only">
            <div className="read-text">
              <div className="mr-3">
                <Img
                  id={`readonly-info`}
                  src={InfoIcon}
                  alt="info"
                  data-for={`readonly-info`}
                  data-tip={`You must login to this dashboard <br />if you want to perform any operation`}
                />
                <ReactTooltip
                  id={`readonly-info`}
                  place={"top"}
                  type={"dark"}
                  effect={"solid"}
                  multiline={true}
                />
              </div>

              <div className="mt-1">Read Only</div>
            </div>
            <div className="login" onClick={logout}>
              Login
            </div>
          </div>
        )}
      </div>

      {isSetupComplete === false && (
        <Link
          to={routeGenerators.dashboard.settings({ safeAddress })}
          className="invite-owners"
        >
          <div className="icon">
            <Img src={InviteIcon} alt="invite" />
          </div>
          <div className="name">Invite Owners</div>
        </Link>
      )}
    </DashboardSidebar>
  );
}
