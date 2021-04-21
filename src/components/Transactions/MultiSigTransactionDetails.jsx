import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useActiveWeb3React, useLocalStorage, useMassPayout } from "hooks";
import Button from "components/common/Button";
import { Card } from "components/common/Card";
import CopyButton from "components/common/Copy";
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
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { minifyAddress, TransactionUrl } from "components/common/Web3Utils";
import StatusText from "./StatusText";
import { getDefaultIconIfPossible } from "constants/index";
import { getTokens } from "store/tokens/actions";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import tokensSaga from "store/tokens/saga";
import tokensReducer from "store/tokens/reducer";
import { Stepper, StepCircle } from "components/common/Stepper";
import addresses from "constants/addresses";
import TransactionSubmitted from "components/Payments/TransactionSubmitted";

import { Table, ActionItem } from "../People/styles";
import { Circle } from "components/Header/styles";
import { Info } from "components/Dashboard-old/styles";
import { Container, Detail, ConfirmSection } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";

const { TableBody, TableHead, TableRow } = Table;

const multisigKey = "multisig";
const safeKey = "safe";
const metaTxKey = "metatx";
const tokensKey = "tokens";

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
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: safeKey, saga: safeSaga });
  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

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
  const icons = useSelector(makeSelectTokenIcons());
  const multisigTransactionId = useSelector(makeSelectMultisigTransactionId());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

  useEffect(() => {
    const transactionId = params && params.transactionId;
    if (ownerSafeAddress && transactionId) {
      dispatch(getMultisigTransactionById(ownerSafeAddress, transactionId));
    }
  }, [dispatch, ownerSafeAddress, params]);

  useEffect(() => {
    if (txHashFromMetaTx) {
      setFinalTxHash(txHashFromMetaTx);
      dispatch(clearMultisigTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

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
    params,
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

  const goBack = () => {
    history.push("/dashboard/transactions");
  };

  const getDecryptedDetails = (data) => {
    if (!encryptionKey) return "";
    return JSON.parse(
      cryptoUtils.decryptDataUsingEncryptionKey(
        data,
        encryptionKey,
        organisationType
      )
    );
  };

  const renderFinalStatus = (confirmedCount, rejectedCount, isExecuted) => {
    // status
    // 0 => default, show nothing
    // 1 => Tx Submitted
    // 2 => Success
    // 3 => Rejected
    if (
      (confirmedCount >= threshold || rejectedCount >= threshold) &&
      !isExecuted
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
    if (approved) return "#3bd800";
    // red
    else if (rejected) return "#ff0a0a";
    else if (account && owner === account) return "#7367f0";
    // pending yellow
    return "#fdbe42";
  };

  const renderConfirmationStatus = (confirmations) => {
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
            title: cryptoUtils.decryptDataUsingEncryptionKey(
              confirmedOwner.ownerInfo.name,
              encryptionKey,
              organisationType
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
          title: cryptoUtils.decryptDataUsingEncryptionKey(
            safeOwner.name,
            encryptionKey,
            organisationType
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
          stepStyles={{ marginBottom: "0" }}
          last={idx === statuses.length - 1}
        />
      )
    );
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

      if (confirmedCount === threshold - 1) {
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
      setApproving(false);
    } catch (error) {
      setApproving(false);
    }
  };

  const rejectTransaction = async () => {
    const {
      safe,
      // to,
      value,
      // data,
      // operation,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      // executionDate,
      // submissionDate,
      // modified, //date
      // blockNumber,
      // transactionHash,
      safeTxHash,
      executor,
      // isExecuted,
      // isSuccessful,
      // ethGasPrice,
      // gasUsed,
      // fee,
      origin,
      // confirmationsRequired,
      // signatures,
      rejectedCount,
      confirmations,
      // txDetails,
    } = transactionDetails;

    try {
      setRejecting(true);

      if (rejectedCount === threshold - 1) {
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
      setRejecting(false);
    } catch (error) {
      setRejecting(false);
    }
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

    let shouldShowConfirmSection = !isExecuted ? true : false;

    // if every owner has voted, but the tx is not executed, that means there is a conflict
    // Ex: 2:2 with 1 approve and 1 reject, 3:3 with 2 approve and 1 reject
    // in this case, show Reject button to all the owners who previously approved
    let shouldShowOnlyReject = false;
    const confirmedOwnersMap = {};

    for (let i = 0; i < confirmations.length; i++) {
      if (!confirmedOwnersMap[confirmations[i].owner])
        confirmedOwnersMap[confirmations[i].owner] = true;
    }

    if (
      Object.keys(confirmedOwnersMap).length === safeOwners.length &&
      !transactionHash
    ) {
      shouldShowOnlyReject = confirmations.find(
        ({ owner, approved }) => owner === account && approved
      );
      return (
        shouldShowOnlyReject && (
          <ConfirmSection>
            <div className="buttons">
              <div className="reject-button">
                <Button
                  type="button"
                  large
                  onClick={rejectTransaction}
                  disabled={loadingTx || updating}
                  loading={rejecting}
                >
                  Reject
                </Button>
              </div>
            </div>
          </ConfirmSection>
        )
      );
    }

    if (confirmedOwnersMap[account] === true) shouldShowConfirmSection = false;

    // If there is any pending transaction, don't allow to execute
    if (
      (rejectedCount === threshold - 1 || confirmedCount === threshold - 1) &&
      !executionAllowed
    ) {
      return (
        shouldShowConfirmSection && (
          <ConfirmSection className="d-flex justify-content-center align-items-center">
            <div className="text-danger">
              You have some pending transactions. Please execute them first.
            </div>
          </ConfirmSection>
        )
      );
    }

    return (
      shouldShowConfirmSection && (
        <ConfirmSection>
          <div className="buttons">
            <div className="approve-button">
              <Button
                type="button"
                large
                onClick={approveTransaction}
                disabled={loadingTx || updating}
                loading={approving}
              >
                Approve
              </Button>
            </div>
            <div className="reject-button">
              <Button
                type="button"
                large
                onClick={rejectTransaction}
                disabled={loadingTx || updating}
                loading={rejecting}
              >
                Reject
              </Button>
            </div>
          </div>
        </ConfirmSection>
      )
    );
  };

  const renderTransactionDetails = () => {
    if (loading || updating)
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          <Loading color="primary" width="50px" height="50px" />
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
    } = transactionDetails;

    const {
      transactionId,
      // addresses,
      transactionHash: txDetailsHash,
      safeAddress,
      to,
      // tokenValue,
      // tokenCurrency,
      fiatValue,
      // fiatCurrency,
      transactionFees,
      status,
      createdOn,
      transactionMode,
      // createdBy,
    } = txDetails;
    const paidTeammates = getDecryptedDetails(to);
    const isMassPayout = transactionMode === TRANSACTION_MODES.MASS_PAYOUT;
    const isQuickTransfer =
      transactionMode === TRANSACTION_MODES.QUICK_TRANSFER;
    const isSpendingLimit =
      transactionMode === TRANSACTION_MODES.SPENDING_LIMITS;

    return (
      <div
        className="position-relative"
        style={{
          transition: "all 0.25s linear",
        }}
      >
        <Info>
          <div
            style={{
              maxWidth: "1200px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {
                  <Button iconOnly className="p-0" onClick={goBack}>
                    <ActionItem>
                      <Circle>
                        <FontAwesomeIcon
                          icon={faLongArrowAltLeft}
                          color="#fff"
                        />
                      </Circle>
                      <div className="mx-3">
                        <div className="name">Back</div>
                      </div>
                    </ActionItem>
                  </Button>
                }
              </div>
            </div>
          </div>
        </Info>

        <Container>
          <Card className="payment-status-card">
            <div className="d-flex justify-content-between align-items-center">
              <div className="payment-status-title">Transaction Status</div>
              {confirmedCount >= threshold || rejectedCount >= threshold ? (
                <div className="status-card ml-3">
                  {renderFinalStatus(confirmedCount, rejectedCount, isExecuted)}
                </div>
              ) : (
                <p className="payment-status-threshold">
                  Transaction requires the confirmation of{" "}
                  <span>
                    {threshold} out of {safeOwners.length}
                  </span>{" "}
                  owners
                </p>
              )}
            </div>
            <div className="confirm-steps-container">
              <Stepper count={safeOwners.length}>
                {renderConfirmationStatus(confirmations)}
              </Stepper>
            </div>
          </Card>
          <div
            style={{
              position: "absolute",
              top: "150px",
              left: "0",
              right: "0",
            }}
          >
            {isMassPayout ? (
              <TableHead col={3} style={{ width: "683px" }} className="mx-auto">
                <div>Full Name</div>
                <div>Disbursement</div>
                <div>Address</div>
              </TableHead>
            ) : isQuickTransfer || isSpendingLimit ? (
              <TableHead
                col={1}
                style={{ width: "683px" }}
                className="mx-auto"
              ></TableHead>
            ) : null}
            <TableBody
              className="mx-auto"
              style={{
                height: "220px",
                minHeight: "0",
                overflow: "auto",
                width: "683px",
              }}
            >
              {paidTeammates && paidTeammates.length > 0 ? (
                paidTeammates.map(
                  ({
                    firstName,
                    lastName,
                    description,
                    address,
                    salaryAmount,
                    salaryToken,
                    allowanceAmount,
                    allowanceToken,
                  }) => {
                    if (isQuickTransfer) {
                      return (
                        <div key={`${firstName}-${lastName}-${address}`}>
                          <div className="grid my-4 mx-4">
                            <Detail>
                              <div className="title">Paid To</div>
                              <div className="desc">
                                {minifyAddress(address)}
                              </div>
                            </Detail>
                            <Detail>
                              <div className="title">Disbursement</div>
                              <div className="desc">
                                <img
                                  src={getDefaultIconIfPossible(
                                    salaryToken,
                                    icons
                                  )}
                                  alt={salaryToken}
                                  width="16"
                                />{" "}
                                {salaryAmount} {salaryToken}
                              </div>
                            </Detail>
                          </div>
                          <div className="d-flex mx-4">
                            <Detail className="w-100">
                              <div className="title">Description</div>
                              <div className="desc">
                                {description || `No description given...`}
                              </div>
                            </Detail>
                          </div>
                        </div>
                      );
                    }

                    if (isSpendingLimit) {
                      return (
                        <div key={`${firstName}-${lastName}-${address}`}>
                          <div className="grid my-4 mx-4">
                            <Detail>
                              <div className="title">Beneficiary</div>
                              <div className="desc">
                                {minifyAddress(address)}
                              </div>
                            </Detail>
                            <Detail>
                              <div className="title">Allowance</div>
                              <div className="desc">
                                <img
                                  src={getDefaultIconIfPossible(
                                    allowanceToken,
                                    icons
                                  )}
                                  alt={allowanceToken}
                                  width="16"
                                />{" "}
                                {allowanceAmount} {allowanceToken}
                              </div>
                            </Detail>
                          </div>
                          <div className="d-flex mx-4">
                            <Detail className="w-100">
                              <div className="title">Description</div>
                              <div className="desc">
                                {description || `No description given...`}
                              </div>
                            </Detail>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <TableRow col={3} key={`${transactionId}-${address}`}>
                        <div>
                          {firstName} {lastName}
                        </div>
                        <div>
                          <img
                            src={getDefaultIconIfPossible(salaryToken, icons)}
                            alt={salaryToken}
                            width="16"
                          />{" "}
                          {salaryAmount} {salaryToken}
                        </div>
                        <div>{minifyAddress(address)}</div>
                      </TableRow>
                    );
                  }
                )
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "400px" }}
                >
                  No transactions found!
                </div>
              )}
            </TableBody>
          </div>
          {txDetailsHash && (
            <Card className="multisig-details-card">
              <div className="d-flex justify-content-between align-items-center">
                <div className="details-title">Details</div>
                <div className="d-flex justify-content-between align-items-center">
                  <Detail style={{ borderRadius: "24px", width: "200px" }}>
                    <div className="title">Transaction Hash</div>
                    <div className="desc">{minifyAddress(txDetailsHash)}</div>
                  </Detail>
                  <Detail
                    style={{ borderRadius: "50%" }}
                    className="d-flex justify-content-center align-items-center ml-3"
                  >
                    <CopyButton
                      id="address"
                      tooltip="transaction hash"
                      value={txDetailsHash}
                      size="lg"
                      color="#7367f0"
                    />
                  </Detail>
                  <Detail
                    style={{ borderRadius: "50%" }}
                    className="d-flex justify-content-center align-items-center ml-3"
                  >
                    <TransactionUrl hash={txDetailsHash}>
                      <FontAwesomeIcon
                        icon={faLink}
                        size="lg"
                        color="#7367f0"
                      />
                    </TransactionUrl>
                  </Detail>
                </div>
              </div>
              {(isMassPayout || isQuickTransfer) && (
                <div className="grid mt-4">
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Paid From</div>
                    <div className="desc">{minifyAddress(safeAddress)}</div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Paid To</div>
                    <div className="desc">
                      {paidTeammates && paidTeammates.length} people
                    </div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Total Amount</div>
                    <div className="desc">US ${fiatValue}</div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Transaction Fees</div>
                    <div className="desc">
                      {parseFloat(transactionFees).toFixed(5)} ETH
                    </div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Created Date & Time</div>
                    <div className="desc">
                      {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
                    </div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Status</div>
                    <div className="desc">
                      <StatusText status={status} />
                    </div>
                  </Detail>
                </div>
              )}
              {isSpendingLimit && (
                <div className="grid mt-4">
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Allowance</div>
                    <div className="desc">US ${fiatValue}</div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Transaction Fees</div>
                    <div className="desc">
                      {parseFloat(transactionFees).toFixed(5)} ETH
                    </div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Created Date & Time</div>
                    <div className="desc">
                      {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
                    </div>
                  </Detail>
                  <Detail style={{ width: "300px" }}>
                    <div className="title">Status</div>
                    <div className="desc">
                      <StatusText status={status} />
                    </div>
                  </Detail>
                </div>
              )}
            </Card>
          )}
          {renderConfirmSection()}
        </Container>
      </div>
    );
  };

  const clearTxHash = () => {
    setFinalTxHash("");
  };

  const noOfPeoplePaid = useMemo(() => {
    return transactionDetails && transactionDetails.txDetails
      ? transactionDetails.txDetails.addresses.length
      : 0;
  }, [transactionDetails]);

  return finalTxHash ? (
    <TransactionSubmitted
      txHash={finalTxHash}
      selectedCount={noOfPeoplePaid}
      clearTxHash={clearTxHash}
      transactionId={multisigTransactionId}
    />
  ) : (
    renderTransactionDetails()
  );
}
