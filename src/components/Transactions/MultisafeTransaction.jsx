import React, { forwardRef } from "react";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";

import StatusText from "./StatusText";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import OutgoingIcon from "assets/icons/dashboard/outgoing.svg";
import { TxRow } from "./styles";
import Img from "components/common/Img";
import { TX_DIRECTION } from "store/transactions/constants";
import { formatNumber } from "utils/number-helpers";
import TransactionName from "./TransactionName";

const MultisafeTransaction = forwardRef(({ transaction }, ref) => {
  const { direction, txDetails } = transaction;

  const history = useHistory();

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
      onClick={() => history.push(`/dashboard/transactions/${transactionId}`)}
      ref={ref}
    >
      <td style={{ width: "35%" }}>
        <div className="d-flex align-items-center">
          <Img
            src={
              direction === TX_DIRECTION.INCOMING ? IncomingIcon : OutgoingIcon
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
      <td style={{ width: "23%" }}>
        <StatusText status={status} textOnly className="status" />
      </td>
      <td style={{ width: "12%" }}>
        <div className="view">View</div>
      </td>
    </TxRow>
  );
});

export default MultisafeTransaction;
