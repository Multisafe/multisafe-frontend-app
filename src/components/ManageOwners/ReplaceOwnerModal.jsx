import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import ReplaceOwner from "./ReplaceOwner";

export const MODAL_NAME = "replace-owner-modal";

function ReplaceOwnerModal(props) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Replace Owner"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <ReplaceOwner handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ReplaceOwnerModal);
