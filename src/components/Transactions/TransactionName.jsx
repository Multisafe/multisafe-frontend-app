import React from "react";
import { useSelector } from "react-redux";

import { TRANSACTION_MODES } from "constants/transactions";
import { getDecryptedDetails } from "utils/encryption";
import { useLocalStorage } from "hooks";
import { makeSelectOrganisationType } from "store/global/selectors";

export default function TransactionName({ to, transactionMode }) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const organisationType = useSelector(makeSelectOrganisationType());

  if (transactionMode === TRANSACTION_MODES.QUICK_TRANSFER) {
    return "Quick Transfer";
  } else if (transactionMode === TRANSACTION_MODES.SPENDING_LIMITS) {
    return "New Spending Limit";
  } else if (transactionMode === TRANSACTION_MODES.MASS_PAYOUT) {
    const payeeDetails = getDecryptedDetails(
      to,
      encryptionKey,
      organisationType
    );

    if (!payeeDetails) return "";

    const { firstName, lastName } = payeeDetails[0];
    const firstPersonName = `${firstName} ${lastName}`;

    return payeeDetails.length === 1 ? (
      <span>{firstPersonName}</span>
    ) : (
      <span>
        {firstPersonName} and {payeeDetails.length - 1} more
      </span>
    );
  }
}