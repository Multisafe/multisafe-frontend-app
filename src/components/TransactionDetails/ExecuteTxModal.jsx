import React, { useState, useEffect } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector, useDispatch } from "react-redux";

import { useActiveWeb3React, useMultisigActions } from "hooks";
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
import {
  makeSelectUpdating,
  makeSelectMultisigTransactionDetails,
} from "store/multisig/selectors";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import { submitMultisigTransaction } from "store/multisig/actions";
import { Information } from "components/Register/styles";
import LinkIcon from "assets/icons/dashboard/link-icon.svg";
import Img from "components/common/Img";
import { useAddresses } from "hooks/useAddresses";
import {GAS_TOKEN_SYMBOL_BY_ID} from "constants/networks";

export const MODAL_NAME = "execute-tx-modal";

function ExecuteTxModal(props) {
  const { MULTISEND_ADDRESS } = useAddresses();

  const { show, handleHide } = props;
  const { account, chainId } = useActiveWeb3React();
  const [isOnChainRejection, setIsOnChainRejection] = useState();

  const {
    txHash,
    loadingTx,
    submitMassPayout,
    txData,
    setTxData,
    approving,
    setApproving,
    rejecting,
    setRejecting,
  } = useMultisigActions();

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
      const { rejectedCount } = transactionDetails;

      if (rejectedCount >= threshold) {
        setIsOnChainRejection(true);
      } else {
        setIsOnChainRejection(false);
      }
    }
  }, [transactionDetails, threshold]);

  const executeTransaction = async () => {
    const {
      safe,
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
      rejectedCount,
      confirmations,
      // txDetails,
    } = transactionDetails;

    try {
      if (rejectedCount >= threshold) {
        setRejecting(true);
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
      } else if (confirmedCount >= threshold) {
        setApproving(true);

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
      }
    } catch (error) {
      console.error(error);
      setApproving(false);
      setRejecting(false);
    }
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Execute Transaction</div>
        <div className="subtitle mb-5">
          You're about to execute a transaction and will have to confirm it with
          your currently connected wallet.
        </div>

        {isOnChainRejection && (
          <div>
            <div className="subtitle text-danger mb-0">
              This is an on-chain rejection that doesn't send any funds.
            </div>
            <div className="subtitle mt-2 mb-4">
              <a
                href="https://help.gnosis-safe.io/en/articles/4738501-why-do-i-need-to-pay-for-cancelling-a-transaction"
                rel="noopener noreferrer"
                target="_blank"
                className="d-flex align-items-center"
              >
                <span className="mt-1">
                  Why do I need to pay for rejecting a transaction?
                </span>

                <span className="ml-2">
                  <Img src={LinkIcon} alt="link" width="12" />
                </span>
              </a>
            </div>
          </div>
        )}

        <Information className="mb-5">
          Make sure you have sufficient {GAS_TOKEN_SYMBOL_BY_ID[chainId]} in this wallet to fund this
          confirmation.
        </Information>

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
              onClick={executeTransaction}
              disabled={loadingTx || updating || isReadOnly}
              loading={approving || rejecting}
            >
              Execute
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ExecuteTxModal);
