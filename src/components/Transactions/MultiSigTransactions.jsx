import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import multisigReducer from "store/multisig/reducer";
import multisigSaga from "store/multisig/saga";
import { getMultisigTransactions } from "store/multisig/actions";
import {
  makeSelectMultisigTransactions,
  makeSelectFetching,
  makeSelectIsPendingTransactions,
  makeSelectMultisigTransactionCount,
} from "store/multisig/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectIsMultiOwner,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
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
import CoinshiftTransaction from "./CoinshiftTransaction";
import Img from "components/common/Img";
import NoTransactionsImg from "assets/icons/dashboard/empty/transaction.svg";

const multisigKey = "multisig";
const LIMIT = 10;

export default function MultiSigTransactions() {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Reducers
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });

  // Sagas
  useInjectSaga({ key: multisigKey, saga: multisigSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectMultisigTransactions());
  const loading = useSelector(makeSelectFetching());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const txCount = useSelector(makeSelectMultisigTransactionCount());
  const isPendingTransactions = useSelector(makeSelectIsPendingTransactions());

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
    if (ownerSafeAddress && hasMore && offset > 0) {
      dispatch(getMultisigTransactions(ownerSafeAddress, offset, LIMIT));
    }
  }, [dispatch, ownerSafeAddress, offset, hasMore]);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getMultisigTransactions(ownerSafeAddress, 0, LIMIT));
    }
  }, [dispatch, ownerSafeAddress]);

  const renderNoTransactionsFound = () => {
    return (
      !loading &&
      offset === 0 && (
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
      )
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
            <CoinshiftTransaction
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
          {isPendingTransactions && !isMultiOwner && (
            <div className="subtitle mt-2">
              One or more transactions have been submitted. They will show up
              here shortly.
            </div>
          )}
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

        <TableBody style={{ maxHeight: "62vh", overflow: "auto" }}>
          {renderAllTransactions()}
          {loading && offset > 0 && <TableLoader height="8rem" colSpan={4} />}
        </TableBody>
      </Table>
    </div>
  );
}
