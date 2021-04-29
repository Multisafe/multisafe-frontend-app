import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import MassPayout from "./index";

export const MODAL_NAME = "mass-payout-modal";

function MassPayoutModal(props) {
  const { show, handleHide } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Mass Payout"} toggle={handleHide} />
      <ModalBody width="94rem" minHeight="auto">
        <MassPayout handleHide={handleHide} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(MassPayoutModal);
