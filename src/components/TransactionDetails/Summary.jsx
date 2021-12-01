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
import TokenImg from "components/common/TokenImg";

export default function Summary({ txDetails, executionDate, paidTeammates }) {
  if (!txDetails) return null;
  const {
    transactionHash: txDetailsHash,
    tokenValue,
    tokenCurrency,
    // tokenValues,
    tokenCurrencies,
    fiatValue,
    // fiatCurrency,
    transactionFees,
    status,
    createdOn,
    transactionMode,
    metaData,
  } = txDetails;

  const renderOptionalCards = () => {
    switch (transactionMode) {
      case TRANSACTION_MODES.MASS_PAYOUT:
      case TRANSACTION_MODES.QUICK_TRANSFER:
        return (
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
        );

      case TRANSACTION_MODES.FLEXIBLE_MASS_PAYOUT:
        return (
          <React.Fragment>
            <div className="detail-card">
              <div className="detail-title">Paid To</div>
              <div className="detail-subtitle">
                {metaData &&
                  metaData.grandTotalSummary &&
                  metaData.grandTotalSummary.count}{" "}
                people
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-title">Total Amount</div>
              <div className="detail-subtitle">
                US ${formatNumber(fiatValue)}
              </div>
            </div>
            <div className="detail-card">
              <div className="detail-title">Tokens Used</div>
              <div className="detail-subtitle">
                {[...new Set(tokenCurrencies)].map((tokenName) => (
                  <TokenImg
                    token={tokenName}
                    className="mr-2"
                    key={tokenName}
                  />
                ))}
              </div>
            </div>
          </React.Fragment>
        );

      case TRANSACTION_MODES.SPENDING_LIMITS:
        return (
          <div className="detail-card">
            <div className="detail-title">Allowance</div>
            <div className="detail-subtitle">US ${formatNumber(fiatValue)}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TransactionDetails>
      <div className="title">Transaction Summary</div>
      <div className="detail-cards">
        {txDetailsHash ? (
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
        ) : (
          <div className="detail-card">
            <div className="detail-title">Transaction Hash</div>
            <div className="detail-subtitle">-</div>
          </div>
        )}

        {renderOptionalCards()}

        <div className="detail-card">
          <div className="detail-title">Transaction Fees</div>
          <div className="detail-subtitle">
            {transactionFees > 0
              ? `${formatNumber(transactionFees, 5)} ETH`
              : `-`}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-title">Created Date & Time</div>
          <div className="detail-subtitle">
            {createdOn && format(new Date(createdOn), "MMM-dd-yyyy HH:mm:ss")}
          </div>
        </div>

        {executionDate ? (
          <div className="detail-card">
            <div className="detail-title">Executed Date & Time</div>
            <div className="detail-subtitle">
              {createdOn &&
                format(new Date(executionDate), "MMM-dd-yyyy HH:mm:ss")}
            </div>
          </div>
        ) : null}

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
