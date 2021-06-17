import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { show } from "redux-modal";

import { useActiveWeb3React, useLocalStorage, useMassPayout } from "hooks";
import Button from "components/common/Button";
import multisigReducer from "store/multisig/reducer";
import multisigSaga from "store/multisig/saga";
import {
  confirmMultisigTransaction,
  submitMultisigTransaction,
  clearMultisigTransactionHash,
  getMultisigTransactionById,
} from "store/multisig/actions";
import {
  makeSelectFetching,
  makeSelectMultisigTransactionHash,
  makeSelectConfirmed,
  makeSelectUpdating,
  makeSelectMultisigTransactionDetails,
  makeSelectMultisigExecutionAllowed,
  makeSelectTransactionId as makeSelectMultisigTransactionId,
} from "store/multisig/selectors";
import safeReducer from "store/safe/reducer";
import safeSaga from "store/safe/saga";
import metaTxReducer from "store/metatx/reducer";
import metaTxSaga from "store/metatx/saga";
import { getMetaTxEnabled } from "store/metatx/actions";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
  makeSelectSafeOwners,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { Stepper, StepCircle } from "components/common/Stepper";
import addresses from "constants/addresses";
import { InfoCard } from "components/People/styles";
import {
  ConfirmSection,
  FinalStatus,
  DescriptionCard,
  DisbursementCard,
  StepperCard,
} from "./styles";
import { getDecryptedDetails } from "utils/encryption";
import { MODAL_NAME as TX_SUBMITTED_MODAL } from "components/Payments/TransactionSubmittedModal";
import DisbursementDetails from "./DisbursementDetails";
import Summary from "./Summary";
import ErrorText from "components/common/ErrorText";
import ApproveTxModal, {
  MODAL_NAME as APPROVE_TX_MODAL,
} from "./ApproveTxModal";
import RejectTxModal, { MODAL_NAME as REJECT_TX_MODAL } from "./RejectTxModal";
import ExecuteTxModal, {
  MODAL_NAME as EXECUTE_TX_MODAL,
} from "./ExecuteTxModal";

const multisigKey = "multisig";
const safeKey = "safe";
const metaTxKey = "metatx";

const { MULTISEND_ADDRESS } = addresses;

export default function MultiSigTransactions() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [finalTxHash, setFinalTxHash] = useState();

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
    rejecting,
    setRejecting,
  } = useMassPayout();

  // Reducers
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });
  useInjectReducer({ key: safeKey, reducer: safeReducer });
  useInjectReducer({ key: metaTxKey, reducer: metaTxReducer });

  // Sagas
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: safeKey, saga: safeSaga });
  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });

  const dispatch = useDispatch();
  const params = useParams();

  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const threshold = useSelector(makeSelectThreshold());
  const txHashFromMetaTx = useSelector(makeSelectMultisigTransactionHash());
  const confirmedStatus = useSelector(makeSelectConfirmed());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const updating = useSelector(makeSelectUpdating());
  const transactionDetails = useSelector(
    makeSelectMultisigTransactionDetails()
  );
  const executionAllowed = useSelector(makeSelectMultisigExecutionAllowed());
  const multisigTransactionId = useSelector(makeSelectMultisigTransactionId());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    const transactionId = params && params.transactionId;
    const safeAddress = params && params.safeAddress;
    if (safeAddress && transactionId) {
      dispatch(getMultisigTransactionById(safeAddress, transactionId));
    }
  }, [dispatch, params]);

  const noOfPeoplePaid = useMemo(() => {
    return transactionDetails && transactionDetails.txDetails
      ? transactionDetails.txDetails.addresses.length
      : 0;
  }, [transactionDetails]);

  useEffect(() => {
    if (txHashFromMetaTx) {
      setFinalTxHash(txHashFromMetaTx);
      dispatch(clearMultisigTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  useEffect(() => {
    if (finalTxHash && multisigTransactionId) {
      dispatch(
        show(TX_SUBMITTED_MODAL, {
          txHash: finalTxHash,
          selectedCount: noOfPeoplePaid,
          transactionId: multisigTransactionId,
          clearTxHash: clearTxHash,
        })
      );
    }
  }, [dispatch, finalTxHash, multisigTransactionId, noOfPeoplePaid]);

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
    if (confirmedStatus) {
      const transactionId = params && params.transactionId;
      dispatch(getMultisigTransactionById(ownerSafeAddress, transactionId));
    }
  }, [confirmedStatus, ownerSafeAddress, params, dispatch]);

  const renderFinalStatus = ({
    confirmedCount,
    rejectedCount,
    isExecuted,
    executor,
  }) => {
    if (
      (confirmedCount >= threshold || rejectedCount >= threshold) &&
      !executor
    ) {
      return <div className="pending">Transaction Submitted</div>;
    }
    if (isExecuted && confirmedCount >= threshold)
      return <div className="success">Success</div>;
    else if (isExecuted && rejectedCount >= threshold)
      return <div className="rejected">Rejected</div>;

    return <div className="failed">Failed</div>;
  };

  const getStatusText = (approved, rejected) => {
    if (approved) return "Approved";
    else if (rejected) return "Rejected";
    return "Pending";
  };

  const getStatusColor = (owner, approved, rejected) => {
    // green
    if (approved) return "#6cb44c";
    // red
    else if (rejected) return "#ff4660";
    else if (account && owner === account) return "#1452f5";
    // pending yellow
    return "#fcbc04";
  };

  const renderConfirmationStatus = (confirmations, createdBy) => {
    if (!confirmations || !confirmations.length) return;

    const statuses =
      safeOwners &&
      safeOwners.map((safeOwner) => {
        const confirmedOwner = confirmations.find(
          (c) => c.owner === safeOwner.owner
        );
        if (confirmedOwner)
          return {
            ...confirmedOwner,
            title: getDecryptedDetails(
              confirmedOwner.ownerInfo.name,
              encryptionKey,
              organisationType,
              false
            ),
            subtitle: getStatusText(
              confirmedOwner.approved,
              confirmedOwner.rejected
            ),
            backgroundColor: getStatusColor(
              confirmedOwner.ownerInfo.owner,
              confirmedOwner.approved,
              confirmedOwner.rejected
            ),
          };
        return {
          ownerInfo: safeOwner,
          title: getDecryptedDetails(
            safeOwner.name,
            encryptionKey,
            organisationType,
            false
          ),
          subtitle: getStatusText(safeOwner.approved, safeOwner.rejected),
          backgroundColor: getStatusColor(
            safeOwner.owner,
            safeOwner.approved,
            safeOwner.rejected
          ),
        };
      });

    return statuses.map(
      ({ ownerInfo, title, subtitle, backgroundColor }, idx) => (
        <StepCircle
          key={`${ownerInfo.owner}-${idx}`}
          title={title}
          subtitle={subtitle}
          backgroundColor={backgroundColor}
          isInitiator={createdBy && ownerInfo.owner === createdBy}
        />
      )
    );
  };

  // const approveTransaction = async () => {
  //   const {
  //     // safe,
  //     // to,
  //     value,
  //     data,
  //     // operation,
  //     gasToken,
  //     safeTxGas,
  //     baseGas,
  //     gasPrice,
  //     refundReceiver,
  //     nonce,
  //     safeTxHash,
  //     executor,
  //     origin,
  //     confirmedCount,
  //     confirmations,
  //     // txDetails,
  //   } = transactionDetails;

  //   try {
  //     setApproving(true);

  //     if (confirmedCount === threshold - 1) {
  //       // submit final approve tx
  //       await submitMassPayout(
  //         {
  //           safe: ownerSafeAddress,
  //           to: MULTISEND_ADDRESS,
  //           value,
  //           data,
  //           operation: 1,
  //           gasToken,
  //           safeTxGas,
  //           baseGas,
  //           gasPrice,
  //           refundReceiver,
  //           nonce,
  //           safeTxHash,
  //           executor,
  //           origin,
  //           confirmations,
  //         },
  //         isMetaEnabled,
  //         true
  //       );
  //     } else {
  //       // call confirm api
  //       await confirmMassPayout({
  //         safe: ownerSafeAddress,
  //         to: MULTISEND_ADDRESS,
  //         value,
  //         data,
  //         operation: 1,
  //         gasToken,
  //         safeTxGas,
  //         baseGas,
  //         gasPrice,
  //         refundReceiver,
  //         nonce,
  //         safeTxHash,
  //         executor,
  //         origin,
  //         confirmations,
  //       });
  //     }
  //     setApproving(false);
  //   } catch (error) {
  //     setApproving(false);
  //   }
  // };

  // const rejectTransaction = async () => {
  //   const {
  //     safe,
  //     // to,
  //     value,
  //     // data,
  //     // operation,
  //     gasToken,
  //     safeTxGas,
  //     baseGas,
  //     gasPrice,
  //     refundReceiver,
  //     nonce,
  //     // executionDate,
  //     // submissionDate,
  //     // modified, //date
  //     // blockNumber,
  //     // transactionHash,
  //     safeTxHash,
  //     executor,
  //     // isExecuted,
  //     // isSuccessful,
  //     // ethGasPrice,
  //     // gasUsed,
  //     // fee,
  //     origin,
  //     // confirmationsRequired,
  //     // signatures,
  //     rejectedCount,
  //     confirmations,
  //     // txDetails,
  //   } = transactionDetails;

  //   try {
  //     setRejecting(true);

  //     if (rejectedCount === threshold - 1) {
  //       // submit final reject tx
  //       await submitMassPayout(
  //         {
  //           safe,
  //           to: safe,
  //           value,
  //           data: "0x",
  //           operation: 0,
  //           gasToken,
  //           safeTxGas,
  //           baseGas,
  //           gasPrice,
  //           refundReceiver,
  //           nonce,
  //           safeTxHash,
  //           executor,
  //           origin,
  //           confirmations,
  //         },
  //         isMetaEnabled,
  //         false
  //       );
  //     } else {
  //       // call confirm api with reject params
  //       await confirmMassPayout({
  //         safe,
  //         to: safe,
  //         value,
  //         data: "0x",
  //         operation: 0,
  //         gasToken,
  //         safeTxGas,
  //         baseGas,
  //         gasPrice,
  //         refundReceiver,
  //         nonce,
  //         safeTxHash,
  //         executor,
  //         origin,
  //         confirmations,
  //       });
  //     }
  //     setRejecting(false);
  //   } catch (error) {}
  // };

  const showApproveModal = () => {
    dispatch(show(APPROVE_TX_MODAL));
  };

  const showRejectModal = () => {
    dispatch(show(REJECT_TX_MODAL));
  };

  const showExecuteModal = () => {
    dispatch(show(EXECUTE_TX_MODAL));
  };

  const renderConfirmSection = () => {
    const {
      isExecuted,
      confirmations,
      txDetails,
      rejectedCount,
      confirmedCount,
    } = transactionDetails;

    const { transactionHash } = txDetails;

    const isConsensusReached =
      rejectedCount >= threshold || confirmedCount >= threshold;

    const confirmedOwnersMap = {};

    for (let i = 0; i < confirmations.length; i++) {
      if (!confirmedOwnersMap[confirmations[i].owner])
        confirmedOwnersMap[confirmations[i].owner] = confirmations[i].approved
          ? "APPROVED"
          : "REJECTED";
    }

    const isConflicted =
      safeOwners.length === threshold &&
      Object.keys(confirmedOwnersMap).length === threshold;

    // current owner has voted and consenus is not yet reached or the tx is executed, dont show
    const shouldShowConfirmSection =
      isExecuted ||
      transactionHash ||
      (!isConflicted && confirmedOwnersMap[account] && !isConsensusReached) ||
      (isConflicted &&
        confirmedOwnersMap[account] === "REJECTED" &&
        !isConsensusReached)
        ? false
        : true;

    const shouldShowOnlyReject =
      !isConsensusReached &&
      shouldShowConfirmSection &&
      isConflicted &&
      confirmedOwnersMap[account] === "APPROVED";

    if (!shouldShowConfirmSection) return null;

    if (!isConsensusReached) {
      // show approve and reject
      return executionAllowed ? (
        <ConfirmSection>
          <div className="buttons">
            {!shouldShowOnlyReject && (
              <div className="approve-button">
                <Button
                  type="button"
                  width="15rem"
                  onClick={showApproveModal}
                  disabled={isReadOnly}
                  loading={approving}
                >
                  Approve
                </Button>
              </div>
            )}
            <div className="reject-button">
              <Button
                type="button"
                width="15rem"
                onClick={showRejectModal}
                disabled={isReadOnly}
                loading={rejecting}
              >
                Reject
              </Button>
            </div>
          </div>
        </ConfirmSection>
      ) : (
        <ConfirmSection className="d-flex justify-content-center align-items-center">
          <ErrorText>
            You have some pending transactions. Please execute them first.
          </ErrorText>
        </ConfirmSection>
      );
    } else {
      return (
        <ConfirmSection>
          <div className="buttons">
            <div className="approve-button">
              <Button
                type="button"
                width="15rem"
                onClick={showExecuteModal}
                disabled={isReadOnly}
                loading={approving}
              >
                Execute
              </Button>
            </div>
          </div>
        </ConfirmSection>
      );
    }

    // if (
    //   safeOwners.length === threshold &&
    //   Object.keys(confirmedOwnersMap).length === threshold &&
    //   rejectedCount !== threshold &&
    //   confirmedCount !== threshold &&
    //   !transactionHash
    // ) {
    //   console.log({ confirmedOwnersMap, confirmedCount, rejectedCount });
    //   shouldShowOnlyReject = true;
    //   return (
    //     shouldShowOnlyReject && (
    //       <ConfirmSection>
    //         <div className="buttons">
    //           <div className="reject-button">
    //             <Button
    //               type="button"
    //               width="15rem"
    //               onClick={showRejectModal}
    //               disabled={isReadOnly}
    //               loading={rejecting}
    //             >
    //               Reject
    //             </Button>
    //           </div>
    //         </div>
    //       </ConfirmSection>
    //     )
    //   );
    // }

    // if (
    //   Object.keys(confirmedOwnersMap).length === safeOwners.length &&
    //   !transactionHash
    // ) {
    //   shouldShowExecuteAndReject = confirmations.find(
    //     ({ owner, approved }) => owner === account && approved
    //   );
    //   return (
    //     shouldShowExecuteAndReject && (
    //       <ConfirmSection>
    //         <div className="buttons">
    //           <div className="approve-button">
    //             <Button
    //               type="button"
    //               width="15rem"
    //               onClick={showExecuteModal}
    //               disabled={isReadOnly}
    //               loading={approving}
    //             >
    //               Execute
    //             </Button>
    //           </div>
    //           <div className="reject-button">
    //             <Button
    //               type="button"
    //               width="15rem"
    //               onClick={showRejectModal}
    //               disabled={isReadOnly}
    //               loading={rejecting}
    //             >
    //               Reject
    //             </Button>
    //           </div>
    //         </div>
    //       </ConfirmSection>
    //     )
    //   );
    // }

    // if (confirmedOwnersMap[account] === true) shouldShowConfirmSection = false;

    // // If there is any pending transaction, don't allow to execute
    // if (
    //   (rejectedCount === threshold - 1 || confirmedCount === threshold - 1) &&
    //   !executionAllowed
    // ) {
    //   return (
    //     shouldShowConfirmSection && (
    //       <ConfirmSection className="d-flex justify-content-center align-items-center">
    //         <ErrorText>
    //           You have some pending transactions. Please execute them first.
    //         </ErrorText>
    //       </ConfirmSection>
    //     )
    //   );
    // }

    // return (
    //   shouldShowConfirmSection && (
    //     <ConfirmSection>
    //       <div className="buttons">
    //         <div className="approve-button">
    //           <Button
    //             type="button"
    //             width="15rem"
    //             onClick={showApproveModal}
    //             disabled={isReadOnly}
    //             loading={approving}
    //           >
    //             Approve
    //           </Button>
    //         </div>
    //         <div className="reject-button">
    //           <Button
    //             type="button"
    //             width="15rem"
    //             onClick={showRejectModal}
    //             disabled={isReadOnly}
    //             loading={rejecting}
    //           >
    //             Reject
    //           </Button>
    //         </div>
    //       </div>
    //     </ConfirmSection>
    // )
    // );
  };

  const renderTransactionDetails = () => {
    if (loading || updating)
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "40rem" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      );

    if (!transactionDetails) return null;

    const {
      // transactionHash,
      // executor,
      isExecuted,
      // isSuccessful,
      rejectedCount,
      confirmedCount,
      confirmations,
      txDetails,
      executor,
    } = transactionDetails;

    const {
      // transactionId,
      // addresses,
      transactionHash: txDetailsHash,
      // safeAddress,
      tokenCurrency,
      to,
      transactionMode,
      createdBy,
    } = txDetails;

    const paidTeammates = getDecryptedDetails(
      to,
      encryptionKey,
      organisationType
    );

    // const isTxSubmitted =
    //   confirmedCount >= threshold || rejectedCount >= threshold;
    const isTxSubmitted = executor ? true : false;

    return (
      <div>
        <InfoCard style={{ minHeight: "0" }}>
          <div>
            <div className="title mb-0">Transaction Status</div>
            {!isTxSubmitted && (
              <div className="subtitle mt-2">
                Transaction requires the confirmation of{" "}
                <span className="text-bold">
                  {threshold} out of {safeOwners.length}
                </span>{" "}
                owners
              </div>
            )}
          </div>
          {isTxSubmitted && (
            <FinalStatus>
              {renderFinalStatus({
                confirmedCount,
                rejectedCount,
                isExecuted,
                executor,
              })}
            </FinalStatus>
          )}
        </InfoCard>

        <StepperCard>
          <Stepper count={safeOwners.length}>
            {renderConfirmationStatus(confirmations, createdBy)}
          </Stepper>
        </StepperCard>

        <DescriptionCard>
          <div className="title">Description</div>
          <div className="subtitle">
            {paidTeammates &&
            paidTeammates.length > 0 &&
            paidTeammates[0].description
              ? paidTeammates[0].description
              : `No description given...`}
          </div>
        </DescriptionCard>

        <DisbursementCard>
          <div className="title">Disbursement Details</div>
          <DisbursementDetails
            paidTeammates={paidTeammates}
            transactionMode={transactionMode}
            tokenCurrency={tokenCurrency}
          />
        </DisbursementCard>

        {txDetailsHash && (
          <Summary txDetails={txDetails} paidTeammates={paidTeammates} />
        )}
        {renderConfirmSection()}
        <ApproveTxModal />
        <RejectTxModal />
        <ExecuteTxModal />
      </div>
    );
  };

  const clearTxHash = () => {
    setFinalTxHash("");
  };

  return renderTransactionDetails();
}
