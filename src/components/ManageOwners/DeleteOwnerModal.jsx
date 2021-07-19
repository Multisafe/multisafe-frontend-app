import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import DeleteOwner from "./DeleteOwner";

export const MODAL_NAME = "replace-owner-modal";

function DeleteOwnerModal(props) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Delete Owner"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <DeleteOwner handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(DeleteOwnerModal);
