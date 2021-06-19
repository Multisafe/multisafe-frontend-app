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
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import {
  confirmMultisigTransaction,
  submitMultisigTransaction,
} from "store/multisig/actions";
import { Information } from "components/Register/styles";

export const MODAL_NAME = "reject-tx-modal";

function RejectTxModal(props) {
  const { show, handleHide } = props;
  const { account } = useActiveWeb3React();

  const {
    txHash,
    loadingTx,
    submitMassPayout,
    confirmMassPayout,
    confirmTxData,
    setConfirmTxData,
    txData,
    setTxData,
    rejecting,
    setRejecting,
  } = useMassPayout();

  const [shouldExecute, setShouldExecute] = useState(true);
  const [showExecute, setShowExecute] = useState(false);

  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const transactionDetails = useSelector(
    makeSelectMultisigTransactionDetails()
  );
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const threshold = useSelector(makeSelectThreshold());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const updating = useSelector(makeSelectUpdating());

  const dispatch = useDispatch();

  useEffect(() => {
    if (txData && transactionDetails && account) {
      dispatch(
        submitMultisigTransaction({
          safeAddress: ownerSafeAddress,
          fromAddress: account,
          transactionId: transactionDetails.txDetails.transactionId,
          txData: txData,
          transactionHash: txHash || "",
          isMetaEnabled,
        })
      );
      setTxData("");
    }
  }, [
    dispatch,
    txHash,
    txData,
    transactionDetails,
    ownerSafeAddress,
    setTxData,
    account,
    isMetaEnabled,
  ]);

  useEffect(() => {
    if (confirmTxData && transactionDetails) {
      dispatch(
        confirmMultisigTransaction({
          safeAddress: ownerSafeAddress,
          transactionId: transactionDetails.txDetails.transactionId,
          txData: confirmTxData,
        })
      );
      setConfirmTxData("");
    }
  }, [
    dispatch,
    confirmTxData,
    transactionDetails,
    ownerSafeAddress,
    setConfirmTxData,
  ]);

  useEffect(() => {
    if (transactionDetails && threshold) {
      const { rejectedCount } = transactionDetails;

      if (rejectedCount === threshold - 1) {
        setShowExecute(true);
      }
    }
  }, [transactionDetails, threshold]);

  const handleToggleCheck = () => {
    setShouldExecute((shouldExecute) => !shouldExecute);
  };

  const rejectTransaction = async () => {
    const {
      safe,
      value,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      safeTxHash,
      executor,
      origin,
      rejectedCount,
      confirmations,
      // txDetails,
    } = transactionDetails;

    try {
      setRejecting(true);

      if (rejectedCount === threshold - 1 && shouldExecute) {
        // submit final reject tx
        await submitMassPayout(
          {
            safe,
            to: safe,
            value,
            data: "0x",
            operation: 0,
            gasToken,
            safeTxGas,
            baseGas,
            gasPrice,
            refundReceiver,
            nonce,
            safeTxHash,
            executor,
            origin,
            confirmations,
          },
          isMetaEnabled,
          false
        );
      } else {
        // call confirm api with reject params
        await confirmMassPayout({
          safe,
          to: safe,
          value,
          data: "0x",
          operation: 0,
          gasToken,
          safeTxGas,
          baseGas,
          gasPrice,
          refundReceiver,
          nonce,
          safeTxHash,
          executor,
          origin,
          confirmations,
        });
      }
    } catch (error) {
      console.error(error);
      setRejecting(false);
    }
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Reject Transaction</div>
        <div className="subtitle mb-5">
          You're about to reject a transaction and will have to confirm it with
          your currently connected wallet.
        </div>
        {showExecute && (
          <React.Fragment>
            <div className="subtitle text-danger mb-4">
              This is an on-chain rejection that doesn't send any funds. If you
              want to reject but execute the transaction manually later, click
              on the checkbox below.
            </div>

            <div>
              <CheckBox
                type="checkbox"
                id="execute-tx"
                checked={shouldExecute}
                onChange={handleToggleCheck}
                label={`Execute Transaction`}
              />
            </div>

            <Information className="my-5">
              Make sure you have sufficient Ether in this wallet to fund this
              confirmation.
            </Information>
          </React.Fragment>
        )}
        <div className="d-flex justify-content-center align-items-center mt-4">
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
            <Button
              width="16rem"
              onClick={rejectTransaction}
              disabled={loadingTx || updating || isReadOnly}
              loading={rejecting}
            >
              Reject
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(RejectTxModal);
