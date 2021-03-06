import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector } from "react-redux";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { AddFunds } from "./styles";
import CopyButton from "components/common/Copy";
import EtherscanLink from "components/common/EtherscanLink";
import { ETHERSCAN_LINK_TYPES } from "components/common/Web3Utils";
import QRCode from "./QRCode";

export const MODAL_NAME = "add-funds-modal";

function AddFundsModal(props) {
  const { show, handleHide } = props;

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const ownerName = useSelector(makeSelectOwnerName());

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Add Funds"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <AddFunds>
          <div className="text">
            This is the address of your Safe. Deposit funds by scanning the QR
            code or copying the address below. Only send Ether and ERC-20 token
            to this address.
          </div>
          {ownerName && <div className="name">{ownerName}</div>}
          {safeAddress && (
            <div className="qr-code">
              <QRCode to={safeAddress} />
            </div>
          )}
          <div className="address">
            <div>{safeAddress}</div>
            <CopyButton
              id="address"
              tooltip="address"
              value={safeAddress}
              className="mx-3"
            />
            <EtherscanLink
              id="etherscan-link"
              type={ETHERSCAN_LINK_TYPES.ADDRESS}
              address={safeAddress}
            />
          </div>
        </AddFunds>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddFundsModal);
