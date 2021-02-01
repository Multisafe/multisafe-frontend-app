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
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { minifyAddress, TransactionUrl } from "components/common/Web3Utils";
import StatusText from "./StatusText";
import { getDefaultIconIfPossible } from "constants/index";
import { Stepper, StepCircle } from "components/common/Stepper";
import addresses from "constants/addresses";
import TransactionSubmitted from "components/Payments/TransactionSubmitted";

import { Table, ActionItem } from "../People/styles";
import { Circle } from "components/Header/styles";
import { Info } from "components/Dashboard/styles";
import { Container, Detail, ConfirmSection } from "./styles";

const { TableBody, TableHead, TableRow } = Table;

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

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

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
      cryptoUtils.decryptDataUsingEncryptionKey(data, encryptionKey)
    );
  };

  const getStatusText = (approved, rejected) => {
    if (approved) return "Approved";
    else if (rejected) return "Rejected";
    return "Pending";
  };

  const getStatusColor = (owner, approved, rejected) => {
    if (approved) return "#3bd800";
    else if (rejected) return "#ff0a0a";
    else if (account && owner === account) return "#7367f0";
    // pending
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
              encryptionKey
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
            encryptionKey
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
    const { isExecuted, confirmations } = transactionDetails;

    let shouldShowConfirmSection = !isExecuted ? true : false;

    for (let i = 0; i < confirmations.length; i++) {
      if (confirmations[i].owner === account) shouldShowConfirmSection = false;
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
    if (loading)
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
      transactionHash,
      // executor,
      isExecuted,
      // isSuccessful,
      // rejectedCount,
      // confirmedCount,
      confirmations,
      txDetails,
    } = transactionDetails;

    const {
      transactionId,
      // addresses,
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
    const isQuickTransfer = transactionMode === 1;

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
              <div className="payment-status-title">Payment Status</div>
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
            {!isQuickTransfer ? (
              <TableHead col={3} style={{ width: "683px" }} className="mx-auto">
                <div>Full Name</div>
                <div>Disbursement</div>
                <div>Address</div>
              </TableHead>
            ) : (
              <TableHead
                col={1}
                style={{ width: "683px" }}
                className="mx-auto"
              ></TableHead>
            )}
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
                  }) => {
                    if (isQuickTransfer)
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
                                  src={getDefaultIconIfPossible(salaryToken)}
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

                    return (
                      <TableRow col={3} key={`${transactionId}-${address}`}>
                        <div>
                          {firstName} {lastName}
                        </div>
                        <div>
                          <img
                            src={getDefaultIconIfPossible(salaryToken)}
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
          {isExecuted && (
            <Card className="multisig-details-card">
              <div className="d-flex justify-content-between align-items-center">
                <div className="details-title">Details</div>
                <div className="d-flex justify-content-between align-items-center">
                  <Detail style={{ borderRadius: "24px", width: "200px" }}>
                    <div className="title">Transaction Hash</div>
                    <div className="desc">{minifyAddress(transactionHash)}</div>
                  </Detail>
                  <Detail
                    style={{ borderRadius: "50%" }}
                    className="d-flex justify-content-center align-items-center ml-3"
                  >
                    <CopyButton
                      id="address"
                      tooltip="transaction hash"
                      value={transactionHash}
                      size="lg"
                      color="#7367f0"
                    />
                  </Detail>
                  <Detail
                    style={{ borderRadius: "50%" }}
                    className="d-flex justify-content-center align-items-center ml-3"
                  >
                    <TransactionUrl hash={transactionHash}>
                      <FontAwesomeIcon
                        icon={faLink}
                        size="lg"
                        color="#7367f0"
                      />
                    </TransactionUrl>
                  </Detail>
                </div>
              </div>
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
            </Card>
          )}
          {renderConfirmSection()}
        </Container>
      </div>
    );
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
      // clearTxHash={clearTxHash}
    />
  ) : (
    renderTransactionDetails()
  );
}