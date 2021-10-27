import React, { forwardRef } from "react";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import StatusText from "./StatusText";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import OutgoingIcon from "assets/icons/dashboard/outgoing.svg";
import Img from "components/common/Img";
import { TX_DIRECTION } from "store/transactions/constants";
import { formatNumber } from "utils/number-helpers";
import TransactionName from "./TransactionName";
import { routeGenerators } from "constants/routes/generators";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { TRANSACTION_MODES } from "constants/transactions";

import { TxRow } from "./styles";
import {
  QuickViewTransaction,
  useQuickViewTransactionState,
} from "components/QuickViewTransaction";
import { TransactionLabels } from "./TransactionLabels";

const CoinshiftTransaction = forwardRef(({ transaction }, ref) => {
  const { direction, txDetails } = transaction;

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  const history = useHistory();

  const { quickViewOpen, onQuickViewOpen, onQuickViewClose } =
    useQuickViewTransactionState();

  const {
    transactionId,
    tokenValue,
    tokenCurrency,
    fiatValue,
    status,
    createdOn,
    transactionMode,
    to,
    labels,
  } = txDetails;

  const renderSwapTokenValue = () => {
    return (
      <React.Fragment>
        <div className="amount">
          {formatNumber(tokenValue, 5)} {tokenCurrency}
        </div>
        <div className="usd">${formatNumber(fiatValue, 2)}</div>
      </React.Fragment>
    );
  };

  const renderDefaultTokenValue = () => {
    return (
      <React.Fragment>
        {tokenValue > 0 ? (
          <div className="amount">
            {/* <TokenImg token={tokenCurrency} /> */}
            {formatNumber(tokenValue, 5)} {tokenCurrency}
          </div>
        ) : null}
        {fiatValue > 0 ? (
          <div className="usd">
            {direction === TX_DIRECTION.INCOMING ? "+" : "-"} $
            {formatNumber(fiatValue, 5)}
          </div>
        ) : null}
      </React.Fragment>
    );
  };

  const renderTokenValue = () => {
    switch (transactionMode) {
      case TRANSACTION_MODES.APPROVE_AND_SWAP:
        return renderSwapTokenValue();
      default:
        return renderDefaultTokenValue();
    }
  };

  const navigateToTransaction = () => {
    history.push(
      routeGenerators.dashboard.transactionById({
        safeAddress,
        transactionId,
      })
    );
  };

  return (
    <React.Fragment>
      <TxRow onClick={navigateToTransaction} ref={ref}>
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
              <div className="name">
                <TransactionName to={to} transactionMode={transactionMode} />
              </div>
              <div className="date">
                {format(new Date(createdOn), "MMM-dd-yyyy HH:mm:ss")}
              </div>
            </div>
          </div>
        </td>
        <td style={{ width: "20%" }}>{renderTokenValue()}</td>
        <td style={{ width: "15%" }}>
          <StatusText status={status} textOnly className="status" />
        </td>
        <td style={{ width: "20%" }}>
          <TransactionLabels labels={labels} />
        </td>
        <td style={{ width: "15%" }} onClick={onQuickViewOpen}>
          <div className="view">Quick View</div>
        </td>
      </TxRow>
      <QuickViewTransaction
        {...{
          isOpen: quickViewOpen,
          onClose: onQuickViewClose,
          txDetails,
          safeAddress,
          navigateToTransaction,
        }}
      />
    </React.Fragment>
  );
});

export default CoinshiftTransaction;
