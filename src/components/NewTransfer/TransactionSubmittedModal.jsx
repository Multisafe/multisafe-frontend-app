import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector } from "react-redux";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import Button from "components/common/Button";
import { TransactionUrl } from "components/common/Web3Utils";
import {
  TxSubmittedContainer,
  ProcessedText,
  ViewTx,
  ButtonsContainer,
} from "./styles/TxSubmitted";
import { routeGenerators } from "constants/routes/generators";
import Img from "components/common/Img";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

export const MODAL_NAME = "tx-submitted-modal";

function TransactionSubmittedModal(props) {
  const {
    show,
    handleHide,
    txHash,
    selectedCount,
    clearTxHash,
    transactionId,
  } = props;

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Transaction Submitted"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <TxSubmittedContainer>
          <div className="text-center">
            <Img
              src={
                "https://images.multisafe.finance/landing-page/transaction-submitted.png"
              }
              alt="submitted"
              width="150"
            />
          </div>

          <ProcessedText>
            {selectedCount
              ? `We are processing the payment of ${selectedCount} people. You can
            track the status of your payment in the transactions section.`
              : "You can track the status of your transction in the transactions section."}
          </ProcessedText>

          <div className="text-center mt-4">
            <ViewTx>
              <TransactionUrl hash={txHash} />
            </ViewTx>
          </div>

          <ButtonsContainer>
            <div>
              <Button
                width="18rem"
                type="button"
                className="secondary"
                to={routeGenerators.dashboard.root({ safeAddress })}
                onClick={handleHide}
              >
                Back to Dashboard
              </Button>
            </div>
            <div>
              <Button
                width="18rem"
                type="button"
                to={routeGenerators.dashboard.transactionById({
                  safeAddress,
                  transactionId,
                })}
                onClick={() => {
                  if (clearTxHash) clearTxHash();
                  handleHide();
                }}
              >
                Track Status
              </Button>
            </div>
          </ButtonsContainer>
        </TxSubmittedContainer>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(TransactionSubmittedModal);
