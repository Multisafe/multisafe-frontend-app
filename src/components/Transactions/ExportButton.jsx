import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { useSelector } from "react-redux";

import Img from "components/common/Img";
import ExportIcon from "assets/icons/dashboard/export-icon.svg";
import { getDecryptedDetails } from "utils/encryption";
import {
  makeSelectIsMultiOwner,
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
  makeSelectSafeOwners,
} from "store/global/selectors";
import { useEncryptionKey } from "hooks";
import { makeSelectMultisigTransactions } from "store/multisig/selectors";
import { makeSelectTransactions } from "store/transactions/selectors";
import { Export } from "components/People/styles";
import { TRANSACTION_MODES } from "constants/transactions";
import { getEtherscanLink } from "components/common/Web3Utils";
import { networkId } from "constants/networks";
import { getDecryptedOwnerName } from "store/invitation/utils";

const joinArray = (arr) => {
  return arr && arr.join("\n");
};

const getStatus = (status) => {
  switch (status) {
    case 0:
      return "Completed";

    case 1:
      return "Pending";

    case 2:
      return "Failed";

    default:
      return null;
  }
};

const getTransactionMode = (transactionMode) => {
  switch (transactionMode) {
    case TRANSACTION_MODES.MASS_PAYOUT:
      return "Mass Payout";

    case TRANSACTION_MODES.QUICK_TRANSFER:
      return "Quick Transfer";

    case TRANSACTION_MODES.SPENDING_LIMITS:
      return "Spending Limit";

    case TRANSACTION_MODES.DELETE_SAFE_OWNER:
      return "Removed Owner";

    case TRANSACTION_MODES.REPLACE_SAFE_OWNER:
      return "Replaced Owner";

    case TRANSACTION_MODES.ADD_SAFE_OWNER:
      return "Added Owner";

    case TRANSACTION_MODES.CHANGE_THRESHOLD:
      return "Changed Threshold";

    default:
      return "";
  }
};

export default function ExportButton() {
  const [encryptionKey] = useEncryptionKey();
  const [csvData, setCsvData] = useState([]);

  const multisigTransactions = useSelector(makeSelectMultisigTransactions());
  const singleOwnerTransactions = useSelector(makeSelectTransactions());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const organisationType = useSelector(makeSelectOrganisationType());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    let csvData = [];

    let transactions;

    if (isMultiOwner) {
      transactions = multisigTransactions;
    } else {
      transactions = singleOwnerTransactions;
    }

    if (transactions && transactions.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        const { direction, txDetails: transaction, txOrigin } = transactions[i];

        // only completed transactions
        if (transaction && transaction.transactionHash) {
          const {
            createdBy,
            safeAddress,
            status,
            transactionId,
            to,
            createdOn,
            transactionFees,
            transactionHash,
            transactionMode,
            fiatValue,
            fiatCurrency,
            addresses,
            tokenCurrency,
            tokenValue,
          } = transaction;

          const paidTeammates = getDecryptedDetails(
            to,
            encryptionKey,
            organisationType
          );

          let createdByName = "";

          let createdByOwner = safeOwners
            ? safeOwners.find(({ owner }) => owner === createdBy)
            : null;
          if (createdByOwner) {
            createdByName = getDecryptedOwnerName({
              encryptedName: createdByOwner.name,
              encryptionKey,
              organisationType,
            });
          }

          let names = [];
          let spentAmounts = [];
          let spentCurrencies = [];
          let spentFiatAmounts = [];
          let spentFiatCurrencies = [];

          for (let i = 0; i < paidTeammates.length; i++) {
            const { firstName, lastName, salaryAmount, salaryToken, usd } =
              paidTeammates[i];

            names.push(`${firstName || ""} ${lastName || ""}`);
            spentAmounts.push(salaryAmount);
            spentCurrencies.push(
              salaryToken === "USD" ? tokenCurrency : salaryToken
            );
            spentFiatAmounts.push(usd);
            spentFiatCurrencies.push("USD");
          }

          csvData.push({
            Date: format(new Date(createdOn), "dd/MM/yyyy"),
            Time: format(new Date(createdOn), "HH:mm:ss"),
            Origin: txOrigin,
            "Transaction Type": direction,
            "Transaction Mode": getTransactionMode(transactionMode),
            Status: getStatus(status),
            To: joinArray(names),
            "Spent Amount": joinArray(spentAmounts),
            "Spent Currency": joinArray(spentCurrencies),
            "Spent Fiat Amount": joinArray(spentFiatAmounts),
            "Spent Fiat Currency": joinArray(spentFiatCurrencies),
            Address: joinArray(addresses),
            "Total Spent Amount": tokenValue,
            "Total Spent Currency": tokenCurrency,
            "Total Fiat Amount": fiatValue,
            "Total Fiat Currency": fiatCurrency,
            "Created By Address": createdBy,
            "Created By Name": createdByName,
            "Transaction ID": transactionId,
            "Transaction Hash": transactionHash || "",
            Link: getEtherscanLink({
              chainId: networkId,
              hash: transactionHash || "",
            }),
            "Transaction fees (ETH)": transactionFees ? transactionFees : "",
            "Safe Address": safeAddress,
          });
        }
        setCsvData(csvData);
      }
    }
  }, [
    encryptionKey,
    organisationType,
    multisigTransactions,
    singleOwnerTransactions,
    isMultiOwner,
    safeOwners,
  ]);

  return (
    <CSVLink
      data={csvData}
      filename={`${safeAddress}-transactions-${format(
        Date.now(),
        "dd/MM/yyyy-HH:mm:ss"
      )}.csv`}
    >
      <Export>
        <div className="text">Export</div>
        <Img src={ExportIcon} alt="export" className="ml-2" />
      </Export>
    </CSVLink>
  );
}
