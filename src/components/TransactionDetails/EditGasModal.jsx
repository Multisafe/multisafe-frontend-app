import React, { useState, useEffect } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector, useDispatch } from "react-redux";

import { useActiveWeb3React, useMassPayout } from "hooks";
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/SimpleModal";
import Button from "components/common/Button";
import {
  makeSelectIsReadOnly,
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
} from "store/global/selectors";
import CheckBox from "components/common/CheckBox";
import {
  makeSelectUpdating,
  makeSelectMultisigTransactionDetails,
} from "store/multisig/selectors";
import addresses from "constants/addresses";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import {
  confirmMultisigTransaction,
  submitMultisigTransaction,
} from "store/multisig/actions";
import { Information } from "components/Register/styles";

export const MODAL_NAME = "edit-gas-modal";

function EditGasModal(props) {
  const { show, handleHide } = props;
  const { account } = useActiveWeb3React();

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Advanced Options</div>
        <div className="subtitle mb-5">Edit the gas limit and gas price.</div>

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div>
            <Button
              width="16rem"
              onClick={handleHide}
              className="secondary mr-4"
            >
              Close
            </Button>
          </div>
          <div>
            <Button width="16rem" onClick={handleHide}>
              Confirm
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(EditGasModal);
