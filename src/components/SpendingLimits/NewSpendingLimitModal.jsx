import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import NewSpendingLimit from "./NewSpendingLimit";

export const MODAL_NAME = "new-spending-limit-modal";

function NewSpendingLimitModal(props) {
  const { show, handleHide } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"New Spending Limit"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <NewSpendingLimit handleHide={handleHide} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(NewSpendingLimitModal);
