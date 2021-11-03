import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/FullPageModal";
// import QuickTransfer from "components/QuickTransfer";
import NewTransfer from "components/NewTransfer";

export const MODAL_NAME = "new-transfer-modal";

function NewTransferModal(props) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Quick Transfer"} toggle={handleHide} />
      <ModalBody width="120rem">
        <NewTransfer handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(NewTransferModal);
