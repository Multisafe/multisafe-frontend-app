import React from "react";
import { format } from "date-fns";

import CopyButton from "components/common/Copy";
import { minifyAddress } from "components/common/Web3Utils";
import StatusText from "components/Transactions/StatusText";
import { TransactionDetails } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import EtherscanLink from "components/common/EtherscanLink";
import { ETHERSCAN_LINK_TYPES } from "components/common/Web3Utils";

export default function Summary({ txDetails, paidTeammates }) {
  if (!txDetails) return null;
  const {
    transactionHash: txDetailsHash,
    tokenValue,
    tokenCurrency,
    fiatValue,
    // fiatCurrency,
    transactionFees,
    status,
    createdOn,
    transactionMode,
  } = txDetails;

  const isSpendingLimit = transactionMode === TRANSACTION_MODES.SPENDING_LIMITS;
  return (
    <TransactionDetails>
      <div className="title">Transaction Details</div>
      <div className="detail-cards">
        <div className="detail-card">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="detail-title">Transaction Hash</div>
              <div className="detail-subtitle">
                {minifyAddress(txDetailsHash)}
              </div>
            </div>
            <div className="icons">
              <CopyButton
                id="address"
                tooltip="transaction hash"
                value={txDetailsHash}
                className="mr-3"
              />
              <EtherscanLink
                id="etherscan-link"
                type={ETHERSCAN_LINK_TYPES.TX}
                hash={txDetailsHash}
              />
            </div>
          </div>
        </div>

        {isSpendingLimit ? (
          <div className="detail-card">
            <div className="detail-title">Allowance</div>
            <div className="detail-subtitle">US ${formatNumber(fiatValue)}</div>
          </div>
        ) : (
          <React.Fragment>
            <div className="detail-card">
              <div className="detail-title">Paid To</div>
              <div className="detail-subtitle">
                {paidTeammates && paidTeammates.length} people
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-title">Total Amount</div>
              <div className="detail-subtitle">
                US ${formatNumber(fiatValue)} ({formatNumber(tokenValue, 5)}{" "}
                {tokenCurrency})
              </div>
            </div>
          </React.Fragment>
        )}

        <div className="detail-card">
          <div className="detail-title">Transaction Fees</div>
          <div className="detail-subtitle">
            {formatNumber(transactionFees, 5)} ETH
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-title">Created Date & Time</div>
          <div className="detail-subtitle">
            {createdOn && format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-title">Status</div>
          <div className="detail-subtitle">
            <StatusText status={status} />
          </div>
        </div>
      </div>
    </TransactionDetails>
  );
}
