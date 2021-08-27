import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import {ChangeThreshold} from "./ChangeThreshold";

export const MODAL_NAME = "change-threshold-modal";

function ChangeThresholdModal(props: FixMe) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Change Threshold"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <ChangeThreshold handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ChangeThresholdModal);
