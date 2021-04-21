import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { makeSelectSafeOwners } from "store/global/selectors";
import Img from "components/common/Img";
import ParcelLogo from "assets/icons/parcel-logo.svg";
import InviteIcon from "assets/icons/sidebar/invite-icon.svg";
import OwnerIcon from "assets/icons/sidebar/owner-icon.svg";
import SettingsIcon from "assets/icons/sidebar/settings-icon.svg";
import LogoutIcon from "assets/icons/sidebar/logout-icon.svg";
import { logoutUser } from "store/logout/actions";
import logoutSaga from "store/logout/saga";
import { useInjectSaga } from "utils/injectSaga";
import { mainNavItems } from "./navItems";

import { DashboardSidebar } from "./styles";
import { routeTemplates } from "constants/routes/templates";
import { useActiveWeb3React, useDropdown } from "hooks";

const logoutKey = "logout";

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const location = useLocation();
  const { onboard } = useActiveWeb3React();
  const { open, toggleDropdown } = useDropdown();

  const dispatch = useDispatch();

  useInjectSaga({ key: logoutKey, saga: logoutSaga });

  const safeOwners = useSelector(makeSelectSafeOwners());

  const logout = async () => {
    if (onboard) {
      await onboard.walletReset();
    }
    dispatch(logoutUser());
  };

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

  const renderOwnerCount = () => {
    if (safeOwners) {
      return `${safeOwners.length} ${
        safeOwners.length > 1 ? "members" : "member"
      }`;
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
            <div className="company-title">Parcel</div>
            <div className="company-subtitle">{renderOwnerCount()}</div>
          </div>
          <div>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <div className={`settings-dropdown ${open && "show"}`}>
            <Link
              to={routeTemplates.dashboard.owners}
              className="settings-option"
            >
              <div className="icon">
                <Img src={OwnerIcon} alt="owners" />
              </div>
              <div className="name">Owners</div>
            </Link>
            <div className="settings-option">
              <div className="icon">
                <Img src={SettingsIcon} alt="settings" />
              </div>
              <div className="name">Settings</div>
            </div>
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

      <div className="invite-owners">
        <div className="icon">
          <Img src={InviteIcon} alt="invite" />
        </div>
        <div className="name">Invite Members</div>
      </div>
    </DashboardSidebar>
  );
}
