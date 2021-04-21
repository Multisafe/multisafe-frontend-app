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
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectFetching,
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
import { Container } from "./styles";

const { TableBody, TableHead, TableRow } = Table;

const transactionsKey = "transactions";
const tokensKey = "tokens";

export default function Transactions() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();
  const history = useHistory();

  const transactions = useSelector(makeSelectTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const icons = useSelector(makeSelectTokenIcons());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(viewTransactions(ownerSafeAddress));
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
      transactions.map(
        ({
          to,
          transactionHash,
          transactionId,
          transactionFees,
          createdOn,
        }) => {
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
              "Transaction Hash": transactionHash,
              "Created On": format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss"),
              "Transaction ID": transactionId,
              "Transaction fees": parseFloat(transactionFees).toFixed(5),
            });
          }
          return csvData;
        }
      );
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
              <div>Transaction Hash</div>
              <div>Total Amount</div>
              <div>Date & Time</div>
              <div>Status</div>
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
                transactions.map(
                  (
                    {
                      transactionId,
                      addresses,
                      transactionHash,
                      safeAddress,
                      to,
                      tokenValue,
                      tokenCurrency,
                      fiatValue,
                      fiatCurrency,
                      transactionFees,
                      status,
                      createdOn,
                      transactionMode,
                    },
                    idx
                  ) => {
                    return (
                      <TableRow key={`${transactionId}-${idx}`}>
                        <div>
                          <TransactionUrl hash={transactionHash}>
                            {minifyAddress(transactionHash)}
                          </TransactionUrl>
                        </div>
                        <div>
                          <img
                            src={getDefaultIconIfPossible(tokenCurrency, icons)}
                            alt={tokenCurrency}
                            width="16"
                          />{" "}
                          {tokenValue} {tokenCurrency} (US $
                          {parseFloat(fiatValue).toFixed(2)})
                        </div>
                        <div>
                          {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
                        </div>
                        <div>
                          <StatusText status={status} />
                        </div>
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
        </Container>
      </div>
    );
  };

  return renderTransactions();
}
