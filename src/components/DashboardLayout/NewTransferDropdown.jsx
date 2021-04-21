import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import { useDropdown } from "hooks";
import Img from "components/common/Img";
import MassPayoutIcon from "assets/icons/navbar/mass-payout.svg";
import PaySomeoneIcon from "assets/icons/navbar/pay-someone.svg";
import AddFundsIcon from "assets/icons/navbar/add-funds.svg";
import { routeTemplates } from "constants/routes/templates";

import { NewTransfer } from "./styles";

export default function NewTransferDropdown() {
  const { open, toggleDropdown } = useDropdown();

  return (
    <NewTransfer onClick={toggleDropdown}>
      <div className="text">New Transfer</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
      <div className={`transfer-dropdown ${open && "show"}`}>
        <Link
          to={routeTemplates.dashboard.quickTransfer}
          className="transfer-option"
        >
          <Img src={MassPayoutIcon} alt="mass-payout" className="icon" />
          <div className="name">Mass Payout</div>
        </Link>
        <div className="transfer-option">
          <Img src={PaySomeoneIcon} alt="pay-someone" className="icon" />
          <div className="name">Pay Someone</div>
        </div>
        <div className="transfer-option">
          <Img src={AddFundsIcon} alt="add-funds" className="icon" />
          <div className="name">Add Funds</div>
        </div>
      </div>
    </NewTransfer>
  );
}
