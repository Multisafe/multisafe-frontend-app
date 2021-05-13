import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  makeSelectOwnerSafeAddress,
  makeSelectSafeOwners,
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
import {
  makeSelectLoading,
  makeSelectIsSetupComplete,
} from "store/invitation/selectors";

import { DashboardSidebar } from "./styles";
import { routeTemplates } from "constants/routes/templates";
import { useActiveWeb3React, useDropdown } from "hooks";

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

  const safeOwners = useSelector(makeSelectSafeOwners());
  const isSetupComplete = useSelector(makeSelectIsSetupComplete());
  const loadingSetupStatus = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const logout = () => {
    if (onboard) {
      onboard.walletReset();
    }
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

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

  console.log({ loadingSetupStatus, isSetupComplete });

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
          <div className="name">Invite Members</div>
        </Link>
      )}
    </DashboardSidebar>
  );
}
