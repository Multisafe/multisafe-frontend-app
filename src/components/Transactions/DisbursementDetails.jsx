import React from "react";

import { Table, TableHead, TableBody } from "components/common/Table";
import { Detail } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";
import TokenImg from "components/common/TokenImg";
import { formatNumber } from "utils/number-helpers";

export default function DisbursementDetails({
  paidTeammates,
  transactionMode,
}) {
  if (!paidTeammates) return null;
  const isMassPayout = transactionMode === TRANSACTION_MODES.MASS_PAYOUT;
  const isQuickTransfer = transactionMode === TRANSACTION_MODES.QUICK_TRANSFER;
  const isSpendingLimit = transactionMode === TRANSACTION_MODES.SPENDING_LIMITS;

  if (isMassPayout) {
    return (
      <Table>
        <TableHead>
          <tr>
            <th style={{ width: "30%" }}>Name</th>
            <th style={{ width: "30%" }}>Disbursement</th>
            <th style={{ width: "40%" }}>Address</th>
          </tr>
        </TableHead>
        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          {paidTeammates.map(
            (
              { firstName, lastName, address, salaryAmount, salaryToken, usd },
              idx
            ) => (
              <tr key={`${idx}-${address}`}>
                <td style={{ width: "30%" }}>
                  {firstName} {lastName}
                </td>
                <td style={{ width: "30%" }}>
                  <TokenImg token={salaryToken} />
                  {salaryToken === "USD"
                    ? `${usd} USD`
                    : `${salaryAmount} ${salaryToken}`}
                </td>
                <td style={{ width: "40%" }}>{address}</td>
              </tr>
            )
          )}
        </TableBody>
      </Table>
    );
  } else if (isQuickTransfer) {
    return paidTeammates.map(
      ({ description, address, salaryAmount, salaryToken, usd }, idx) => (
        <div key={`${idx}-${address}`}>
          <div className="grid my-4 mx-4">
            <Detail>
              <div className="title">Paid To</div>
              <div className="desc">{address}</div>
            </Detail>
            <Detail>
              <div className="title">Disbursement</div>
              <div className="desc">
                <TokenImg token={salaryToken} />

                {salaryToken === "USD"
                  ? `${formatNumber(usd)} USD`
                  : `${formatNumber(salaryAmount, 5)} ${salaryToken}`}
              </div>
            </Detail>
          </div>
          <div className="d-flex mx-4">
            <Detail className="w-100">
              <div className="title">Description</div>
              <div className="desc">
                {description || `No description given...`}
              </div>
            </Detail>
          </div>
        </div>
      )
    );
  } else if (isSpendingLimit) {
    return paidTeammates.map(
      ({ description, address, allowanceAmount, allowanceToken }, idx) => (
        <div key={`${idx}-${address}`}>
          <div className="grid my-4 mx-4">
            <Detail>
              <div className="title">Beneficiary</div>
              <div className="desc">{address}</div>
            </Detail>
            <Detail>
              <div className="title">Allowance</div>
              <div className="desc">
                <TokenImg token={allowanceToken} />
                {allowanceAmount} {allowanceToken}
              </div>
            </Detail>
          </div>
          <div className="d-flex mx-4">
            <Detail className="w-100">
              <div className="title">Description</div>
              <div className="desc">
                {description || `No description given...`}
              </div>
            </Detail>
          </div>
        </div>
      )
    );
  }

  return null;
}
