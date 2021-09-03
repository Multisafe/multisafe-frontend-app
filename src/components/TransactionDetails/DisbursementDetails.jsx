import React from "react";
import { useSelector } from "react-redux";

import { Table, TableHead, TableBody } from "components/common/Table";
import { TRANSACTION_MODES } from "constants/transactions";
import TokenImg from "components/common/TokenImg";
import { formatNumber } from "utils/number-helpers";
import { useEncryptionKey } from "hooks";
import { makeSelectOrganisationType } from "store/global/selectors";
import { getDecryptedDetails } from "utils/encryption";
import Avatar from "components/common/Avatar";
import { DisbursementCard } from "./styles";

export default function DisbursementDetails({
  paidTeammates,
  transactionMode,
  tokenCurrency,
  metaData,
}) {
  const [encryptionKey] = useEncryptionKey();
  const organisationType = useSelector(makeSelectOrganisationType());

  const renderMassPayoutDetails = () => (
    <Table>
      <TableHead>
        <tr>
          <th style={{ width: "30%" }}>Name</th>
          <th style={{ width: "30%" }}>Disbursement</th>
          <th style={{ width: "40%" }}>Address</th>
        </tr>
      </TableHead>
      <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
        {paidTeammates &&
          paidTeammates.map(
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

  const renderQuickTransferDetails = () => (
    <Table>
      <TableHead>
        <tr>
          <th>Paid To</th>
          <th>Disbursement</th>
        </tr>
      </TableHead>
      <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
        {paidTeammates &&
          paidTeammates.map(
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

  const renderSpendingLimitDetails = () => (
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

  const renderDeleteOwnerDetails = () => {
    if (!metaData) return null;

    const { deletedOwner, newThreshold, ownersCount } = metaData;
    if (!deletedOwner) return null;

    const { name, address } = deletedOwner;
    const ownerName = getDecryptedDetails(
      name,
      encryptionKey,
      organisationType,
      false
    );

    const firstName = ownerName.split(" ")[0];
    const lastName = ownerName.split(" ")[1];

    return (
      <Table>
        <TableHead>
          <tr>
            <th style={{ width: "25%" }}>Owner Name</th>
            <th style={{ width: "35%" }}>Address</th>
            <th style={{ width: "20%" }}>Threshold</th>
            <th style={{ width: "20%" }}>Action Taken</th>
          </tr>
        </TableHead>
        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          <tr style={{ backgroundColor: "#ffecef" }}>
            <td style={{ width: "25%" }}>
              <div className="d-flex align-items-center">
                <Avatar
                  className="mr-3"
                  firstName={firstName}
                  lastName={lastName}
                />
                <div>{ownerName}</div>
              </div>
            </td>
            <td style={{ width: "35%" }}>{address}</td>
            <td style={{ width: "20%" }}>
              {newThreshold} out of {ownersCount}
            </td>

            <td style={{ color: "#ff4660", width: "20%" }}>Remove</td>
          </tr>
        </TableBody>
      </Table>
    );
  };

  const renderReplaceOwnerDetails = () => {
    if (!metaData) return null;
    const { oldOwner, newOwner } = metaData;

    if (!oldOwner || !newOwner) return null;

    const { name: oldName, address: oldOwnerAddress } = oldOwner;
    const { name: newName, address: newOwnerAddress } = newOwner;

    const oldOwnerName = getDecryptedDetails(
      oldName,
      encryptionKey,
      organisationType,
      false
    );
    const newOwnerName = getDecryptedDetails(
      newName,
      encryptionKey,
      organisationType,
      false
    );

    const oldFirstName = oldOwnerName.split(" ")[0];
    const oldLastName = oldOwnerName.split(" ")[1];

    const newFirstName = newOwnerName.split(" ")[0];
    const newLastName = newOwnerName.split(" ")[1];

    return (
      <Table>
        <TableHead>
          <tr>
            <th style={{ width: "30%" }}>Owner Name</th>
            <th style={{ width: "45%" }}>Address</th>
            <th style={{ width: "25%" }}>Action Taken</th>
          </tr>
        </TableHead>
        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          <tr style={{ backgroundColor: "#ffecef" }}>
            <td style={{ width: "30%" }}>
              <div className="d-flex align-items-center">
                <Avatar
                  className="mr-3"
                  firstName={oldFirstName}
                  lastName={oldLastName}
                />
                <div>{oldOwnerName}</div>
              </div>
            </td>
            <td style={{ width: "45%" }}>{oldOwnerAddress}</td>
            <td className="text-red" style={{ width: "25%" }}>
              Remove
            </td>
          </tr>
          <tr>
            <td style={{ width: "30%" }}>
              <div className="d-flex align-items-center">
                <Avatar
                  className="mr-3"
                  firstName={newFirstName}
                  lastName={newLastName}
                />
                <div>{newOwnerName}</div>
              </div>
            </td>
            <td style={{ width: "45%" }}>{newOwnerAddress}</td>
            <td className="text-primary" style={{ width: "25%" }}>
              Add
            </td>
          </tr>
        </TableBody>
      </Table>
    );
  };

  const renderAddOwnerDetails = () => {
    if (!metaData) return null;
    const { newOwner, newThreshold, ownersCount } = metaData;

    if (!newOwner) return null;

    const { name: newName, address: newOwnerAddress } = newOwner;

    const newOwnerName = getDecryptedDetails(
      newName,
      encryptionKey,
      organisationType,
      false
    );

    const newFirstName = newOwnerName.split(" ")[0];
    const newLastName = newOwnerName.split(" ")[1];

    return (
      <Table>
        <TableHead>
          <tr>
            <th style={{ width: "25%" }}>Owner Name</th>
            <th style={{ width: "35%" }}>Address</th>
            <th style={{ width: "20%" }}>Threshold</th>
            <th style={{ width: "20%" }}>Action Taken</th>
          </tr>
        </TableHead>
        <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
          <tr>
            <td style={{ width: "25%" }}>
              <div className="d-flex align-items-center">
                <Avatar
                  className="mr-3"
                  firstName={newFirstName}
                  lastName={newLastName}
                />
                <div>{newOwnerName}</div>
              </div>
            </td>
            <td style={{ width: "35%" }}>{newOwnerAddress}</td>
            <td style={{ width: "20%" }}>
              {newThreshold} out of {ownersCount}
            </td>
            <td className="text-primary" style={{ width: "20%" }}>
              Add
            </td>
          </tr>
        </TableBody>
      </Table>
    );
  };

  const renderTransactionDetails = () => {
    switch (transactionMode) {
      case TRANSACTION_MODES.MASS_PAYOUT:
        return renderMassPayoutDetails();
      case TRANSACTION_MODES.QUICK_TRANSFER:
        return renderQuickTransferDetails();
      case TRANSACTION_MODES.SPENDING_LIMITS:
        return renderSpendingLimitDetails();
      case TRANSACTION_MODES.DELETE_SAFE_OWNER:
        return renderDeleteOwnerDetails();
      case TRANSACTION_MODES.REPLACE_SAFE_OWNER:
        return renderReplaceOwnerDetails();
      case TRANSACTION_MODES.ADD_SAFE_OWNER:
        return renderAddOwnerDetails();

      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (transactionMode) {
      case TRANSACTION_MODES.MASS_PAYOUT:
      case TRANSACTION_MODES.QUICK_TRANSFER:
        return <div className="title">Disbursement Details</div>;

      case TRANSACTION_MODES.SPENDING_LIMITS:
        return <div className="title">Spending Limit Details</div>;

      case TRANSACTION_MODES.ADD_SAFE_OWNER:
      case TRANSACTION_MODES.DELETE_SAFE_OWNER:
      case TRANSACTION_MODES.REPLACE_SAFE_OWNER:
        return <div className="title">Owner Details</div>;

      default:
        return null;
    }
  };

  const title = renderTitle();
  const transactionDetails = renderTransactionDetails();

  return title || transactionDetails ? (
    <DisbursementCard>
      {title}
      {transactionDetails}
    </DisbursementCard>
  ) : null;
}
