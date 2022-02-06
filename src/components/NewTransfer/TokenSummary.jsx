import { memo } from "react";

import { formatNumber } from "utils/number-helpers";
import ErrorText from "components/common/ErrorText";
import {
  PaymentSummary,
  PaymentInfo,
  PaymentTitle,
  PaymentSubtitle,
} from "./styles/PaymentSummary";

const TokenSummary = ({ summary, showFiatEquivalent = true, ...rest }) => {
  if (!summary) return null;

  const {
    tokenName,
    count,
    tokenTotal,
    usdTotal,
    isInsufficientBalance,
    currentTokenBalance,
    currentUsdBalance,
    tokenBalanceAfterPayment,
    usdBalanceAfterPayment,
  } = summary;

  return (
    <PaymentSummary {...rest}>
      <PaymentInfo>
        <div>
          <PaymentTitle>Current Balance</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {`${formatNumber(currentTokenBalance, 5)} ${tokenName}`}
          </PaymentSubtitle>
          {showFiatEquivalent && (
            <PaymentSubtitle>
              {`US$ ${formatNumber(currentUsdBalance)}`}
            </PaymentSubtitle>
          )}
        </div>
        <div>
          <PaymentTitle>Balance after payment</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {!isInsufficientBalance ? (
              `${formatNumber(tokenBalanceAfterPayment)} ${tokenName}`
            ) : (
              <ErrorText hideError>Insufficient Balance</ErrorText>
            )}
          </PaymentSubtitle>
          {showFiatEquivalent && (
            <PaymentSubtitle>
              {!isInsufficientBalance
                ? `US$ ${formatNumber(usdBalanceAfterPayment)}`
                : ``}
            </PaymentSubtitle>
          )}
        </div>
        <div>
          <PaymentTitle>Total Selected</PaymentTitle>
          <PaymentSubtitle>{count} people</PaymentSubtitle>
        </div>
        <div>
          <PaymentTitle>Total Amount</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {!isNaN(tokenTotal)
              ? `${formatNumber(tokenTotal)} ${tokenName}`
              : `0`}
          </PaymentSubtitle>
          {showFiatEquivalent && (
            <PaymentSubtitle>
              {!isNaN(usdTotal) ? `US$ ${formatNumber(usdTotal)}` : `0`}
            </PaymentSubtitle>
          )}
        </div>
      </PaymentInfo>
    </PaymentSummary>
  );
};

export default memo(TokenSummary);
