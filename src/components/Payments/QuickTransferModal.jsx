import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import QuickTransfer from "components/QuickTransfer";

export const MODAL_NAME = "quick-transfer-modal";

function QuickTransferModal(props) {
  const { show, handleHide } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Quick Transfer"} toggle={handleHide} />
      <ModalBody width="72rem" minHeight="auto">
        <QuickTransfer handleHide={handleHide} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(QuickTransferModal);
