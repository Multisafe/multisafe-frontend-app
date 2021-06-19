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

export const MODAL_NAME = "approve-tx-modal";
const { MULTISEND_ADDRESS } = addresses;

function ApproveTxModal(props) {
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
    approving,
    setApproving,
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
    if (transactionDetails && threshold) {
      const { confirmedCount } = transactionDetails;

      if (confirmedCount === threshold - 1) {
        setShowExecute(true);
      }
    }
  }, [transactionDetails, threshold]);

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

  const handleToggleCheck = () => {
    setShouldExecute((shouldExecute) => !shouldExecute);
  };

  const approveTransaction = async () => {
    const {
      // safe,
      // to,
      value,
      data,
      // operation,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      safeTxHash,
      executor,
      origin,
      confirmedCount,
      confirmations,
      // txDetails,
    } = transactionDetails;

    try {
      setApproving(true);

      if (confirmedCount === threshold - 1 && shouldExecute) {
        // submit final approve tx
        await submitMassPayout(
          {
            safe: ownerSafeAddress,
            to: MULTISEND_ADDRESS,
            value,
            data,
            operation: 1,
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
          true
        );
      } else {
        // call confirm api
        await confirmMassPayout({
          safe: ownerSafeAddress,
          to: MULTISEND_ADDRESS,
          value,
          data,
          operation: 1,
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
      setApproving(false);
    }
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Approve Transaction</div>
        <div className="subtitle mb-5">
          You're about to approve a transaction and will have to confirm it with
          your currently connected wallet.
        </div>
        {showExecute && (
          <React.Fragment>
            <div className="subtitle text-danger mb-4">
              Approving this transaction executes it right away. If you want to
              approve but execute the transaction manually later, click on the
              checkbox below.
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
            <Button
              width="16rem"
              onClick={approveTransaction}
              disabled={loadingTx || updating || isReadOnly}
              loading={approving}
            >
              Approve
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ApproveTxModal);
