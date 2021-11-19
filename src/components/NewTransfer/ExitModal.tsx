import React from "react";
import { connectModal as reduxModal, hide } from "redux-modal";
import { useDispatch } from "react-redux";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/SimpleModal";
import Button from "components/common/Button";
import { resetTransferStore } from "store/new-transfer/actions";

import { MODAL_NAME as NEW_TRANSFER_MODAL } from "./NewTransferModal";

export const MODAL_NAME = "exit-new-transfer-modal";

type Props = {
  show: boolean;
  handleHide: () => void;
};
function ExitNewTransferModal(props: Props) {
  const { show, handleHide } = props;

  const dispatch = useDispatch();

  const confirmExit = async () => {
    handleHide();
    dispatch(hide(NEW_TRANSFER_MODAL));

    // TODO: fix this hack, without timeout the summary is not reset
    await new Promise((resolve) =>
      setTimeout(() => resolve(dispatch(resetTransferStore())))
    );
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Confirm Exit</div>
        <div className="subtitle">Are you sure you want to exit?</div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <div>
            <Button
              width="16rem"
              onClick={handleHide}
              className="secondary mr-4"
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button width="16rem" onClick={confirmExit}>
              Exit
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ExitNewTransferModal);
