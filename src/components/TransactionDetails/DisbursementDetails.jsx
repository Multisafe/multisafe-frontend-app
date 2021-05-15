import React from "react";

import { Table, TableHead, TableBody } from "components/common/Table";
import { TRANSACTION_MODES } from "constants/transactions";
import TokenImg from "components/common/TokenImg";
import { formatNumber } from "utils/number-helpers";

export default function DisbursementDetails({
  paidTeammates,
  transactionMode,
  tokenCurrency,
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
                    ? `${formatNumber(usd)} USD (${formatNumber(
                        salaryAmount,
                        5
                      )} ${tokenCurrency})`
                    : `${formatNumber(salaryAmount, 5)} ${salaryToken}`}
                </td>
                <td style={{ width: "40%" }}>{address}</td>
              </tr>
            )
          )}
        </TableBody>
      </Table>
    );
  } else if (isQuickTransfer) {
    return (
      <Table>
        <TableHead>
          <tr>
            <th>Paid To</th>
            <th>Disbursement</th>
          </tr>
        </TableHead>
        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          {paidTeammates.map(
            ({ address, salaryAmount, salaryToken, usd }, idx) => (
              <tr key={`${idx}-${address}`}>
                <td>{address}</td>
                <td>
                  <TokenImg token={salaryToken} />
                  {salaryToken === "USD"
                    ? `${usd} USD`
                    : `${formatNumber(salaryAmount, 5)} ${salaryToken}`}
                </td>
              </tr>
            )
          )}
        </TableBody>
      </Table>
    );
  } else if (isSpendingLimit) {
    return (
      <Table>
        <TableHead>
          <tr>
            <th>Beneficiary</th>
            <th>Allowance</th>
          </tr>
        </TableHead>
        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          {paidTeammates.map(
            ({ address, allowanceAmount, allowanceToken }, idx) => (
              <tr key={`${idx}-${address}`}>
                <td>{address}</td>
                <td>
                  <TokenImg token={allowanceToken} />
                  {formatNumber(allowanceAmount, 5)} {allowanceToken}
                </td>
              </tr>
            )
          )}
        </TableBody>
      </Table>
    );
  }

  return null;
}
