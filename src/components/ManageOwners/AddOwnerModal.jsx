import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import AddOwner from "./AddOwner";

export const MODAL_NAME = "add-owner-modal";

function AddOwnerModal(props) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Add Owner"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <AddOwner handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddOwnerModal);
