import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import MultiSigTransactions from "./MultiSigTransactions";
import { TransactionLabels } from "./TransactionLabels";

const TABS = {
  TRANSACTIONS: "1",
  LABELS: "2",
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

export default function Transactions() {
  const [activeTab, setActiveTab] = useState(TABS.TRANSACTIONS);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <style>{navStyles}</style>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={`${activeTab === TABS.TRANSACTIONS ? "active" : ""}`}
            onClick={() => toggleTab(TABS.TRANSACTIONS)}
          >
            Transactions
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === TABS.LABELS ? "active" : ""}`}
            onClick={() => toggleTab(TABS.LABELS)}
          >
            Labels
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={TABS.TRANSACTIONS}>
          <div className="mt-5">
            <MultiSigTransactions />
          </div>
        </TabPane>
        <TabPane tabId={TABS.LABELS}>
          <div className="mt-5">
            <TransactionLabels />
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
}
