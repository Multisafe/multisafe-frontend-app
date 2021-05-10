import React, { useEffect } from "react";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import multisigReducer from "store/multisig/reducer";
import multisigSaga from "store/multisig/saga";
import { getMultisigTransactions } from "store/multisig/actions";
import {
  makeSelectMultisigTransactions,
  makeSelectFetching,
} from "store/multisig/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import StatusText from "./StatusText";
import { InfoCard } from "../People/styles";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import OutgoingIcon from "assets/icons/dashboard/outgoing.svg";
import ExportButton from "./ExportButton";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
  TableLoader,
} from "components/common/Table";
import { TxRow } from "./styles";
import { formatNumber } from "utils/number-helpers";
import Img from "components/common/Img";
import { TX_DIRECTION, TX_ORIGIN } from "store/transactions/constants";
import TransactionName from "./TransactionName";

const multisigKey = "multisig";

export default function MultiSigTransactions() {
  // Reducers
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });

  // Sagas
  useInjectSaga({ key: multisigKey, saga: multisigSaga });

  const dispatch = useDispatch();
  const history = useHistory();

  const transactions = useSelector(makeSelectMultisigTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMultisigTransactions(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  const renderNoTransactionsFound = () => {
    return (
      <TableInfo
        style={{
          fontSize: "1.4rem",
          fontWeight: "500",
          textAlign: "center",
          height: "10rem",
        }}
      >
        <td colSpan={4}>No transactions found!</td>
      </TableInfo>
    );
  };

  const renderMultisafeTransaction = (transaction, idx) => {
    const { direction, txDetails } = transaction;

    const {
      transactionId,
      tokenValue,
      tokenCurrency,
      fiatValue,
      status,
      createdOn,
      transactionMode,
      to,
    } = txDetails;
    return (
      <TxRow
        key={`${transactionId}-${idx}`}
        onClick={() => history.push(`/dashboard/transactions/${transactionId}`)}
      >
        <td style={{ width: "35%" }}>
          <div className="d-flex align-items-center">
            <Img
              src={
                direction === TX_DIRECTION.INCOMING
                  ? IncomingIcon
                  : OutgoingIcon
              }
              alt={direction}
              className="direction"
            />
            <div>
              <div className="name">
                <TransactionName to={to} transactionMode={transactionMode} />
              </div>
              <div className="date">
                {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
              </div>
            </div>
          </div>
        </td>
        <td style={{ width: "30%" }}>
          <div className="amount">
            {/* <TokenImg token={tokenCurrency} /> */}
            {formatNumber(tokenValue, 5)} {tokenCurrency}
          </div>
          <div className="usd">
            {direction === TX_DIRECTION.INCOMING ? "+" : "-"} $
            {formatNumber(fiatValue, 5)}
          </div>
        </td>
        <td style={{ width: "25%" }}>
          <StatusText status={status} textOnly className="status" />
        </td>
        <td style={{ width: "12%" }}>
          <div className="view">View</div>
        </td>
      </TxRow>
    );
  };

  const renderGnosisTransaction = (transaction, idx) => {
    const { direction, txDetails } = transaction;

    const { transactionId, status, createdOn } = txDetails;
    return (
      <TxRow key={`${transactionId}-${idx}`}>
        <td style={{ width: "35%" }}>
          <div className="d-flex align-items-center">
            <Img
              src={
                direction === TX_DIRECTION.INCOMING
                  ? IncomingIcon
                  : OutgoingIcon
              }
              alt={direction}
              className="direction"
            />
            <div>
              <div className="name">Gnosis</div>
              <div className="date">
                {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
              </div>
            </div>
          </div>
        </td>
        <td style={{ width: "30%" }}>
          <div className="amount">-</div>
        </td>
        <td style={{ width: "23%" }}>
          <StatusText status={status} textOnly />
        </td>
        <td style={{ width: "12%" }}>
          <div className="view">View</div>
        </td>
      </TxRow>
    );
  };

  const renderTransactions = () => {
    if (loading) return <TableLoader colSpan={4} />;

    return transactions && transactions.length > 0
      ? transactions.map((transaction, idx) => {
          const { txOrigin, txDetails } = transaction;
          if (!txDetails) return null;

          if (txOrigin === TX_ORIGIN.GNOSIS) {
            return renderGnosisTransaction(transaction, idx);
          }

          return renderMultisafeTransaction(transaction, idx);
        })
      : renderNoTransactionsFound();
  };

  return (
    <div>
      <InfoCard>
        <div>
          <div className="title">Transactions</div>
          <div className="subtitle">Track your transaction status here</div>
        </div>
        <div>
          <ExportButton />
        </div>
      </InfoCard>

      <Table style={{ marginTop: "4rem" }}>
        <TableHead>
          <tr>
            <th style={{ width: "35%" }}>Transaction</th>
            <th style={{ width: "30%" }}>Total Amount</th>
            <th style={{ width: "23%" }}>Status</th>
            <th style={{ width: "12%" }}></th>
          </tr>
        </TableHead>

        <TableBody>{renderTransactions()}</TableBody>
      </Table>
    </div>
  );
}
