import React, { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Img from "components/common/Img";
import OwnersIcon from "assets/icons/dashboard/owners-icon.svg";
import SpendingLimitsIcon from "assets/icons/dashboard/spending-limits-icon.svg";
import ProfileIcon from "assets/icons/dashboard/profile-icon.svg";
import SpendingLimits from "components/SpendingLimits";
import ManageOwners from "components/ManageOwners";
import Profile from "components/Profile";
import { getSafeInfo } from "store/global/actions";
import { useActiveWeb3React } from "hooks";
import {FEATURE_NAMES, useFeatureManagement} from "hooks/useFeatureManagement";

const TABS = {
  OWNERS: "1",
  SPENDING_LIMITS: "2",
  PROFILE: "3",
};

const navStyles = `
  .nav-tabs {
    border-bottom: solid 0.1rem #dddcdc;
    grid-gap: 1rem 6rem;
  }

  @media (max-width: 600px) {
    .nav-tabs {
      flex-wrap: wrap;
      grid-gap: 1rem;
    }
  }

  .nav-link {
    font-size: 1.6rem;
    font-weight: bold;
    letter-spacing: normal;
    color: #aaaaaa;
    cursor: pointer;
    opacity: 0.4;
    padding: 1rem 1.8rem;
    min-width: 12rem;
    text-align: center;
  }

  .nav-tabs .nav-link {
    border: none;
  }

  .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    border-bottom: 0.8rem solid #1452f5;
    border-bottom-right-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;
  }

  .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {
    border: 0;
    opacity: 1;
  }

  .nav-link.active {
    opacity: 1;
    border: none;
    font-size: 1.6rem;
    font-weight: bold;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    padding: 1rem 1.8rem;
    min-width: 12rem;
  }

  .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    background: none;
    color: #373737;
    border-bottom: 0.8rem solid #1452f5;
  }
`;

export default function Settings() {
  const [activeTab, setActiveTab] = useState(TABS.OWNERS);
  const { account, chainId } = useActiveWeb3React();
  const {isFeatureEnabled} = useFeatureManagement();

  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (account) {
      dispatch(getSafeInfo(params.safeAddress, account, 0));
    }
  }, [dispatch, account, params.safeAddress, chainId]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <style>{navStyles}</style>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={`${activeTab === TABS.OWNERS ? "active" : ""}`}
            onClick={() => toggleTab(TABS.OWNERS)}
          >
            <Img src={OwnersIcon} alt="owners" className="mr-2" />
            <span>Owners</span>
          </NavLink>
        </NavItem>
        {isFeatureEnabled(FEATURE_NAMES.SPENDING_LIMIT) ? (
          <NavItem>
            <NavLink
              className={`${activeTab === TABS.SPENDING_LIMITS ? "active" : ""}`}
              onClick={() => toggleTab(TABS.SPENDING_LIMITS)}
            >
              <Img
                src={SpendingLimitsIcon}
                alt="spending-limits"
                className="mr-2"
              />
              <span>Spending Limits</span>
            </NavLink>
          </NavItem>
        ) : null}
        <NavItem>
          <NavLink
            className={`${activeTab === TABS.PROFILE ? "active" : ""}`}
            onClick={() => toggleTab(TABS.PROFILE)}
          >
            <Img src={ProfileIcon} width="18" alt="profile" className="mr-2" />
            <span>Profile</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={TABS.OWNERS}>
          <ManageOwners />
        </TabPane>
        {isFeatureEnabled(FEATURE_NAMES.SPENDING_LIMIT) ? (
          <TabPane tabId={TABS.SPENDING_LIMITS}>
            <div className="mt-5">
              <SpendingLimits />
            </div>
          </TabPane>
        ) : null}
        <TabPane tabId={TABS.PROFILE}>
          <div className="mt-5">
            <Profile />
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
}
