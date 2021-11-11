import React, { forwardRef } from "react";
import { format } from "date-fns";

import StatusText from "./StatusText";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import OutgoingIcon from "assets/icons/dashboard/outgoing.svg";
import { TxRow } from "./styles";
import Img from "components/common/Img";
import { TX_DIRECTION } from "store/transactions/constants";
import { formatNumber } from "utils/number-helpers";
import TokenImg from "components/common/TokenImg";
import {
  QuickViewTransaction,
  useQuickViewTransactionState,
} from "components/QuickViewTransaction";
import { TransactionLabels } from "./TransactionLabels";

const GnosisTransaction = forwardRef(({ transaction }, ref) => {
  const { direction, txDetails } = transaction;

  const { quickViewOpen, onQuickViewOpen, onQuickViewClose } =
    useQuickViewTransactionState();

  const {
    status,
    createdOn,
    fiatValue,
    tokenCurrencies,
    transactionHash,
    labels,
  } = txDetails;

  const navigateToTransaction = () => {
    window.open(txDetails.txLink);
  };

  const transactionName =
    direction === TX_DIRECTION.INCOMING ? `Incoming` : `Gnosis`;

  return (
    <React.Fragment>
      <TxRow
        onClick={navigateToTransaction}
        ref={ref}
        quickViewOpen={quickViewOpen}
      >
        <td style={{ width: "30%" }}>
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
              <div className="name">{transactionName}</div>
              <div className="date">
                {format(new Date(createdOn), "MMM-dd-yyyy HH:mm:ss")}
              </div>
            </div>
          </div>
        </td>
        <td style={{ width: "20%" }}>
          {tokenCurrencies && tokenCurrencies.length > 0 && (
            <div className="amount">
              {tokenCurrencies.map((token) => (
                <TokenImg token={token} key={token} />
              ))}
            </div>
          )}
          {fiatValue > 0 && (
            <div className="usd">
              {direction === TX_DIRECTION.INCOMING ? "+" : "-"} $
              {formatNumber(fiatValue, 5)}
            </div>
          )}
        </td>
        <td style={{ width: "15%" }}>
          <StatusText status={status} textOnly />
        </td>
        <td
          onClick={transactionHash ? onQuickViewOpen : null}
          style={{ width: "20%" }}
        >
          <TransactionLabels labels={labels} />
        </td>
        <td
          onClick={transactionHash ? onQuickViewOpen : null}
          style={{ width: "15%" }}
        >
          {transactionHash ? <div className="view">Quick View</div> : null}
        </td>
      </TxRow>
      <QuickViewTransaction
        {...{
          isOpen: quickViewOpen,
          onClose: onQuickViewClose,
          txDetails,
          navigateToTransaction,
          transactionName,
        }}
      />
    </React.Fragment>
  );
});

export default GnosisTransaction;
