import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import Img from "components/common/Img";
import ParcelLogo from "assets/icons/parcel-logo.svg";
import InviteIcon from "assets/icons/sidebar/invite-icon.svg";
import SettingsIcon from "assets/icons/sidebar/settings-icon.svg";
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
import EtherscanLink from "components/common/EtherscanLink";
import { ETHERSCAN_LINK_TYPES } from "components/common/Web3Utils";
import { DashboardSidebar } from "./styles";
import { routeTemplates } from "constants/routes/templates";
import { useActiveWeb3React, useDropdown } from "hooks";
import { minifyAddress } from "components/common/Web3Utils";

const logoutKey = "logout";
const invitationKey = "invitation";

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const location = useLocation();
  const { onboard } = useActiveWeb3React();
  const { open, toggleDropdown } = useDropdown();

  const dispatch = useDispatch();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });
  useInjectSaga({ key: logoutKey, saga: logoutSaga });

  const isSetupComplete = useSelector(makeSelectIsSetupComplete());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const ownerName = useSelector(makeSelectOwnerName());

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

  const renderNavItem = ({ link, href, name, icon, activeIcon }) => {
    if (link) {
      const active = location.pathname === link;
      return (
        <Link
          key={name}
          to={link}
          className={`menu-item ${active && "menu-item-highlighted"}`}
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
      <div className="parcel-logo">
        <Img src={ParcelLogo} alt="parcel" width="100%" />
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
              <div className="name">{safeAddress}</div>
              <div className="d-flex mt-2">
                <CopyButton
                  id="address"
                  tooltip="address"
                  value={safeAddress}
                  className="mr-3"
                />
                <EtherscanLink
                  id="etherscan-link"
                  type={ETHERSCAN_LINK_TYPES.ADDRESS}
                  address={safeAddress}
                />
              </div>
            </div>
            <Link
              to={routeTemplates.dashboard.settings}
              className="settings-option"
            >
              <div className="icon">
                <Img src={SettingsIcon} alt="settings" />
              </div>
              <div className="name">Settings</div>
            </Link>
            <div className="settings-option" onClick={logout}>
              <div className="icon">
                <Img src={LogoutIcon} alt="logout" />
              </div>
              <div className="name">Logout</div>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-items">
        {mainNavItems.map((navItem) => renderNavItem(navItem))}
      </div>

      {isSetupComplete === false && (
        <Link to={routeTemplates.dashboard.settings} className="invite-owners">
          <div className="icon">
            <Img src={InviteIcon} alt="invite" />
          </div>
          <div className="name">Invite Owners</div>
        </Link>
      )}
    </DashboardSidebar>
  );
}
