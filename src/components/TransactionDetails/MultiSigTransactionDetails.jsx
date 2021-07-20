import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { show } from "redux-modal";

import { useActiveWeb3React, useLocalStorage } from "hooks";
import Button from "components/common/Button";
import multisigReducer from "store/multisig/reducer";
import multisigSaga from "store/multisig/saga";
import {
  clearMultisigTransactionHash,
  getMultisigTransactionById,
} from "store/multisig/actions";
import {
  makeSelectFetching,
  makeSelectMultisigTransactionHash,
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

const DECISIONS = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export default function MultiSigTransactions() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [finalTxHash, setFinalTxHash] = useState();

  const { account } = useActiveWeb3React();

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
    const transactionId = params.transactionId;
    if (ownerSafeAddress && transactionId) {
      dispatch(getMultisigTransactionById(ownerSafeAddress, transactionId));
    }
  }, [dispatch, params.transactionId, ownerSafeAddress, account]);

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
      dispatch(
        getMultisigTransactionById(ownerSafeAddress, multisigTransactionId)
      );
    }
  }, [
    dispatch,
    finalTxHash,
    multisigTransactionId,
    noOfPeoplePaid,
    ownerSafeAddress,
  ]);

  const renderFinalStatus = ({
    confirmedCount,
    rejectedCount,
    isExecuted,
    txDetailsHash,
  }) => {
    if (txDetailsHash && !isExecuted) {
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

  const renderConfirmationStatus = ({ confirmations, createdBy, executor }) => {
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
          isExecutor={executor && ownerInfo.owner === executor}
        />
      )
    );
  };

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
          ? DECISIONS.APPROVED
          : DECISIONS.REJECTED;
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
        confirmedOwnersMap[account] === DECISIONS.REJECTED &&
        !isConsensusReached)
        ? false
        : true;

    const shouldShowOnlyReject =
      !isConsensusReached &&
      shouldShowConfirmSection &&
      isConflicted &&
      confirmedOwnersMap[account] === DECISIONS.APPROVED;

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
              >
                Execute
              </Button>
            </div>
          </div>
        </ConfirmSection>
      );
    }
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
      isExecuted,
      rejectedCount,
      confirmedCount,
      confirmations,
      txDetails,
      executor,
    } = transactionDetails;

    const {
      transactionHash: txDetailsHash,
      tokenCurrency,
      to,
      transactionMode,
      createdBy,
      metaData,
    } = txDetails;

    const paidTeammates = getDecryptedDetails(
      to,
      encryptionKey,
      organisationType
    );

    const isTxSubmitted = txDetailsHash ? true : false;

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
                txDetailsHash,
              })}
            </FinalStatus>
          )}
        </InfoCard>

        <StepperCard>
          <Stepper count={safeOwners.length}>
            {renderConfirmationStatus({ confirmations, createdBy, executor })}
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
          <DisbursementDetails
            paidTeammates={paidTeammates}
            transactionMode={transactionMode}
            tokenCurrency={tokenCurrency}
            metaData={metaData}
          />
        </DisbursementCard>

        <Summary txDetails={txDetails} paidTeammates={paidTeammates} />
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
