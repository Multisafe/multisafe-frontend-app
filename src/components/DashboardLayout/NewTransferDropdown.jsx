import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { show } from "redux-modal";

import { useDropdown } from "hooks";
import Img from "components/common/Img";
import MassPayoutIcon from "assets/icons/navbar/mass-payout.svg";
import PaySomeoneIcon from "assets/icons/navbar/pay-someone.svg";
import AddFundsIcon from "assets/icons/navbar/add-funds.svg";
import MassPayoutModal, {
  MODAL_NAME as MASS_PAYOUT_MODAL,
} from "components/Payments/MassPayoutModal";
import QuickTransferModal, {
  MODAL_NAME as QUICK_TRANSFER_MODAL,
} from "components/Payments/QuickTransferModal";
import AddFundsModal, {
  MODAL_NAME as ADD_FUNDS_MODAL,
} from "components/AddFunds";
import TransactionSubmittedModal from "components/Payments/TransactionSubmittedModal";

import { NewTransfer } from "./styles";

export default function NewTransferDropdown() {
  const { open, toggleDropdown } = useDropdown();

  const dispatch = useDispatch();

  const showMassPayoutModal = () => {
    dispatch(show(MASS_PAYOUT_MODAL));
  };

  const showQuickTransferModal = () => {
    dispatch(show(QUICK_TRANSFER_MODAL));
  };

  const showAddFundsModal = () => {
    dispatch(show(ADD_FUNDS_MODAL));
  };

  return (
    <NewTransfer onClick={toggleDropdown}>
      <div className="text">New Transfer</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
      <div className={`transfer-dropdown ${open && "show"}`}>
        <div className="transfer-option" onClick={showMassPayoutModal}>
          <Img src={MassPayoutIcon} alt="mass-payout" className="icon" />
          <div className="name">Mass Payout</div>
        </div>
        <div className="transfer-option" onClick={showQuickTransferModal}>
          <Img src={PaySomeoneIcon} alt="pay-someone" className="icon" />
          <div className="name">Quick Transfer</div>
        </div>
        <div className="transfer-option" onClick={showAddFundsModal}>
          <Img src={AddFundsIcon} alt="add-funds" className="icon" />
          <div className="name">Add Funds</div>
        </div>
      </div>

      <MassPayoutModal />
      <QuickTransferModal />
      <AddFundsModal />
      <TransactionSubmittedModal />
    </NewTransfer>
  );
}
