import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";

import { useLocalStorage } from "hooks";
import Button from "components/common/Button";
import multisigReducer from "store/multisig/reducer";
import multisigSaga from "store/multisig/saga";
import { getMultisigTransactions } from "store/multisig/actions";
import {
  makeSelectMultisigTransactions,
  makeSelectFetching,
} from "store/multisig/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { minifyAddress } from "components/common/Web3Utils";
import StatusText from "./StatusText";
import { getDefaultIconIfPossible } from "constants/index";
import { getTokens } from "store/tokens/actions";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import tokensSaga from "store/tokens/saga";
import tokensReducer from "store/tokens/reducer";
import { Table, ActionItem } from "../People/styles";
import { Circle } from "components/Header/styles";
import { Info } from "components/Dashboard-old/styles";
import { Container } from "./styles";

const { TableBody, TableHead, TableRow } = Table;

const multisigKey = "multisig";
const tokensKey = "tokens";

export default function MultiSigTransactions() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  // Reducers
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();
  const history = useHistory();

  const transactions = useSelector(makeSelectMultisigTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const icons = useSelector(makeSelectTokenIcons());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMultisigTransactions(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

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

  const renderTransactions = () => {
    let csvData = [];
    if (transactions && transactions.length > 0) {
      transactions.map((transaction) => {
        if (transaction && transaction.transactionHash) {
          const {
            transactionId,
            to,
            createdOn,
            transactionFees,
            transactionHash,
          } = transaction;
          const paidTeammates = getDecryptedDetails(to);
          for (let i = 0; i < paidTeammates.length; i++) {
            const {
              firstName,
              lastName,
              salaryAmount,
              salaryToken,
              address,
            } = paidTeammates[i];
            csvData.push({
              "First Name": firstName,
              "Last Name": lastName,
              "Salary Token": salaryToken,
              "Salary Amount": salaryAmount,
              Address: address,
              "Transaction Hash": transactionHash || "",
              "Created On": format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss"),
              "Transaction ID": transactionId,
              "Transaction fees": transactionFees
                ? parseFloat(transactionFees).toFixed(5)
                : "",
            });
          }
        }
        return csvData;
      });
    }
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
            }}
            className="mx-auto"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div>
                  <div className="title">Transactions</div>
                  <div className="subtitle">
                    Track your transaction status here
                  </div>
                </div>
              </div>

              <CSVLink
                data={csvData}
                filename={`transactions-${format(
                  Date.now(),
                  "dd/MM/yyyy-HH:mm:ss"
                )}.csv`}
              >
                <Button iconOnly className="p-0">
                  <ActionItem>
                    <Circle>
                      <FontAwesomeIcon icon={faDownload} color="#fff" />
                    </Circle>
                    <div className="mx-3">
                      <div className="name">Export as CSV</div>
                    </div>
                  </ActionItem>
                </Button>
              </CSVLink>
            </div>
          </div>
        </Info>

        <Container>
          <div>
            <TableHead>
              <div>Total Amount</div>
              <div>Date & Time</div>
              <div>Status</div>
              <div>Initiated By</div>
              <div></div>
            </TableHead>

            <TableBody>
              {loading ? (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "400px" }}
                >
                  <Loading color="primary" width="50px" height="50px" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction, idx) => {
                  // const { txDetails } = transaction;

                  const {
                    transactionId,
                    tokenValue,
                    tokenCurrency,
                    fiatValue,
                    status,
                    createdOn,
                    createdBy,
                  } = transaction;
                  return (
                    <TableRow key={`${transactionId}-${idx}`}>
                      <div>
                        <img
                          src={getDefaultIconIfPossible(tokenCurrency, icons)}
                          alt={tokenCurrency}
                          width="16"
                        />{" "}
                        {parseFloat(tokenValue).toFixed(2)} {tokenCurrency} (US
                        ${parseFloat(fiatValue).toFixed(2)})
                      </div>
                      <div>
                        {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
                      </div>
                      <div>
                        <StatusText status={status} />
                      </div>
                      <div>{minifyAddress(createdBy)}</div>
                      <div
                        className="d-flex justify-content-end purple-text"
                        onClick={() =>
                          history.push(
                            `/dashboard/transactions/${transactionId}`
                          )
                        }
                      >
                        VIEW
                      </div>
                    </TableRow>
                  );
                })
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
        </Container>
      </div>
    );
  };

  return renderTransactions();
}
