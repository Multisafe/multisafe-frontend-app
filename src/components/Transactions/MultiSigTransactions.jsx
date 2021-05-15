import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import multisigReducer from "store/multisig/reducer";
import multisigSaga from "store/multisig/saga";
import { getMultisigTransactions } from "store/multisig/actions";
import {
  makeSelectMultisigTransactions,
  makeSelectFetching,
  // makeSelectMultisigTransactionCount,
} from "store/multisig/selectors";
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
import Img from "components/common/Img";
import NoTransactionsImg from "assets/icons/dashboard/empty/transaction.svg";

const multisigKey = "multisig";

export default function MultiSigTransactions() {
  // Reducers
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });

  // Sagas
  useInjectSaga({ key: multisigKey, saga: multisigSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectMultisigTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  // const txCount = useSelector(makeSelectMultisigTransactionCount());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMultisigTransactions(ownerSafeAddress, 0, 5));
    }
  }, [dispatch, ownerSafeAddress]);

  // const getMoreTransactions = () => {
  //   console.log("getting more tx", transactions);
  //   if (transactions && transactions.length > 0) {
  //     dispatch(
  //       getMultisigTransactions(ownerSafeAddress, transactions.length + 1, 5)
  //     );
  //   }
  // };

  const renderNoTransactionsFound = () => {
    return (
      <TableInfo
        style={{
          textAlign: "center",
          height: "40rem",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#8b8b8b",
        }}
      >
        <td colSpan={4}>
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <Img src={NoTransactionsImg} alt="no-assets" className="mb-4" />
              <div className="text-center">No Transactions</div>
            </div>
          </div>
        </td>
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

        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          {renderAllTransactions()}
        </TableBody>
      </Table>
    </div>
  );
}
