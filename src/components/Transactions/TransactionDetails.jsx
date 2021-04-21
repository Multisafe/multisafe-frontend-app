import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { useLocalStorage } from "hooks";
import Button from "components/common/Button";
import { Card } from "components/common/Card";
import CopyButton from "components/common/Copy";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { getTransactionById } from "store/transactions/actions";
import {
  makeSelectFetching,
  makeSelectTransactionDetails,
} from "store/transactions/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { minifyAddress, TransactionUrl } from "components/common/Web3Utils";
import StatusText from "./StatusText";
import { getDefaultIconIfPossible } from "constants/index";
import { getTokens } from "store/tokens/actions";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import tokensSaga from "store/tokens/saga";
import tokensReducer from "store/tokens/reducer";
import { Table, ActionItem } from "../People/styles";
import { Circle } from "components/Header/styles";
import { Info } from "components/Dashboard-old/styles";
import { Container, Detail } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";

const { TableBody, TableHead, TableRow } = Table;

const transactionsKey = "transactions";
const tokensKey = "tokens";

export default function TransactionDetails() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const transactionDetails = useSelector(makeSelectTransactionDetails());
  const icons = useSelector(makeSelectTokenIcons());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (ownerSafeAddress) {
      const transactionId = params && params.transactionId;
      dispatch(getTransactionById(ownerSafeAddress, transactionId));
    }
  }, [dispatch, ownerSafeAddress, params]);

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

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
      transactionId,
      transactionHash,
      safeAddress,
      to,
      fiatValue,
      transactionFees,
      status,
      createdOn,
      transactionMode,
    } = transactionDetails;
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
          <div
            style={{
              position: "absolute",
              top: "-100px",
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
                        <div>
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
          <Card className="details-card">
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
                    <FontAwesomeIcon icon={faLink} size="lg" color="#7367f0" />
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
        </Container>
      </div>
    );
  };

  return renderTransactionDetails();
}
