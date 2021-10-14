import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";

import Img from "components/common/Img";
import ExportIcon from "assets/icons/dashboard/export-icon.svg";
import { getDecryptedDetails } from "utils/encryption";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
  makeSelectSafeOwners,
} from "store/global/selectors";
import { useEncryptionKey } from "hooks";
import { makeSelectMultisigTransactions } from "store/multisig/selectors";
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

    case TRANSACTION_MODES.APPROVE_AND_SWAP:
      return "Swap Tokens";

    default:
      return "";
  }
};

export default function ExportButton() {
  const [encryptionKey] = useEncryptionKey();
  const [csvData, setCsvData] = useState([]);

  const multisigTransactions = useSelector(makeSelectMultisigTransactions());
  const organisationType = useSelector(makeSelectOrganisationType());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    let csvData = [];

    let transactions = multisigTransactions;

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
            notes
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
          let txDescription = "";

          for (let i = 0; i < paidTeammates.length; i++) {
            const {
              firstName,
              lastName,
              salaryAmount,
              salaryToken,
              usd,
              description,
            } = paidTeammates[i];

            names.push(`${firstName || ""} ${lastName || ""}`);
            spentAmounts.push(salaryAmount);
            spentCurrencies.push(
              salaryToken === "USD" ? tokenCurrency : salaryToken
            );
            spentFiatAmounts.push(usd);
            spentFiatCurrencies.push("USD");

            if (!txDescription) {
              txDescription = description;
            }
          }

          csvData.push({
            Date: format(new Date(createdOn), "dd/MM/yyyy"),
            Time: format(new Date(createdOn), "HH:mm:ss"),
            Origin: txOrigin,
            "Transaction Type": direction,
            "Transaction Mode": getTransactionMode(transactionMode),
            Status: getStatus(status),
            Description: txDescription,
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
            "Note": cryptoUtils.decryptDataUsingEncryptionKey(
              notes,
              encryptionKey,
              organisationType
            )
          });
        }
        setCsvData(csvData);
      }
    }
  }, [encryptionKey, organisationType, multisigTransactions, safeOwners]);

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
