import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
// import QuickTransfer from "components/QuickTransfer";
import FlexibleQuickTransfer from "components/QuickTransfer/FlexibleQuickTransfer";

export const MODAL_NAME = "quick-transfer-modal";

function QuickTransferModal(props) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Quick Transfer"} toggle={handleHide} />
      <ModalBody width="120rem" minHeight="auto">
        <FlexibleQuickTransfer handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(QuickTransferModal);
