import React, { memo } from "react";
import { formatNumber } from "utils/number-helpers";
import {
  PaymentInfo,
  PaymentSubtitle,
  PaymentSummary,
  PaymentTitle,
} from "../styles/PaymentSummary";

const StreamBatchSummary = ({ summary, ...rest }) => {
  if (!summary) return null;
  console.log({ summary });
  const { count, estimatedNettFlowRate, token } = summary;
  const depositValue = formatNumber(estimatedNettFlowRate * 4 * 3600);
  const monthlyEstimate = formatNumber(estimatedNettFlowRate * 30 * 24 * 3600);
  return (
    <PaymentSummary {...rest}>
      <PaymentInfo>
        <div>
          <PaymentTitle>Total balance</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {/* {`$${formatNumber(usdTotal, 5)}`} */}
          </PaymentSubtitle>
        </div>
        <div>
          <PaymentTitle>Total people</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {count} people
          </PaymentSubtitle>
        </div>
        <div>
          <PaymentTitle>Deposit</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {/* Superfluid deposits 4h worth of stream on Prod */}
            {`${depositValue}  ${token.value}`}
          </PaymentSubtitle>
        </div>
        <div>
          <PaymentTitle>Estimated amount (per month)</PaymentTitle>
          <PaymentSubtitle className="text-bold">
            {`${monthlyEstimate} ${token.value}`}
          </PaymentSubtitle>
        </div>
      </PaymentInfo>
    </PaymentSummary>
  );
};

export default memo(StreamBatchSummary);
