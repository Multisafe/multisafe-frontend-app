import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectFetching,
} from "store/transactions/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { InfoCard } from "../People/styles";
import ExportButton from "./ExportButton";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
  TableLoader,
} from "components/common/Table";
import { TX_ORIGIN } from "store/transactions/constants";
import GnosisTransaction from "./GnosisTransaction";
import MultisafeTransaction from "./MultisafeTransaction";

const transactionsKey = "transactions";

export default function Transactions() {
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(viewTransactions(ownerSafeAddress));
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

  const renderAllTransactions = () => {
    if (loading) return <TableLoader colSpan={4} />;

    return transactions && transactions.length > 0
      ? transactions.map((transaction, idx) => {
          const { txOrigin, txDetails } = transaction;
          if (!txDetails) return null;

          if (txOrigin === TX_ORIGIN.GNOSIS) {
            return (
              <GnosisTransaction
                transaction={transaction}
                key={`${transaction.transactionId}-${idx}`}
              />
            );
          }

          return (
            <MultisafeTransaction
              transaction={transaction}
              key={`${transaction.transactionId}-${idx}`}
            />
          );
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

        <TableBody>{renderAllTransactions()}</TableBody>
      </Table>
    </div>
  );
}
