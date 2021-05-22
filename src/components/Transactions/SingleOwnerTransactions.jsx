import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectFetching,
  makeSelectTransactionCount,
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
import Img from "components/common/Img";
import NoTransactionsImg from "assets/icons/dashboard/empty/transaction.svg";

const transactionsKey = "transactions";
const LIMIT = 10;

export default function Transactions() {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false); // eslint-disable-line

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const txCount = useSelector(makeSelectTransactionCount());

  // for infinite scroll
  const observer = useRef();

  const lastTxElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      const options = { rootMargin: "0px 0px 640px 0px" };

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setOffset((offset) => offset + LIMIT);
        }
      }, options);

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    setHasMore(txCount > 0);
  }, [txCount]);

  useEffect(() => {
    if (ownerSafeAddress) {
      // dispatch(viewTransactions(ownerSafeAddress, offset, LIMIT)); // with pagination
      dispatch(viewTransactions(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(viewTransactions(ownerSafeAddress, 0, LIMIT));
    }
  }, [dispatch, ownerSafeAddress]);

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
    if (loading && offset === 0) return <TableLoader colSpan={4} />;

    return transactions && transactions.length > 0
      ? transactions.map((transaction, idx) => {
          const { txOrigin, txDetails } = transaction;
          if (!txDetails) return null;

          if (txOrigin === TX_ORIGIN.GNOSIS) {
            return (
              <GnosisTransaction
                transaction={transaction}
                key={`${transaction.transactionId}-${idx}`}
                ref={idx === transactions.length - 1 ? lastTxElementRef : null}
              />
            );
          }

          return (
            <MultisafeTransaction
              transaction={transaction}
              key={`${transaction.transactionId}-${idx}`}
              ref={idx === transactions.length - 1 ? lastTxElementRef : null}
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

        <TableBody style={{ maxHeight: "48rem", overflow: "auto" }}>
          {renderAllTransactions()}
          {loading && offset > 0 && <TableLoader height="8rem" colSpan={4} />}
        </TableBody>
      </Table>
    </div>
  );
}
