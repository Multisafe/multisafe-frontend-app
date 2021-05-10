import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { useSelector } from "react-redux";

import Img from "components/common/Img";
import ExportIcon from "assets/icons/dashboard/export-icon.svg";
import { getDecryptedDetails } from "utils/encryption";
import { makeSelectOrganisationType } from "store/global/selectors";
import { useLocalStorage } from "hooks";
import { makeSelectMultisigTransactions } from "store/multisig/selectors";
import { Export } from "components/People/styles";

export default function ExportButton() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [csvData, setCsvData] = useState([]);

  const transactions = useSelector(makeSelectMultisigTransactions());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    let csvData = [];
    if (transactions && transactions.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        const { direction, txDetails: transaction, txOrigin } = transactions[i];

        if (transaction && transaction.transactionHash) {
          const {
            transactionId,
            to,
            createdOn,
            transactionFees,
            transactionHash,
          } = transaction;
          const paidTeammates = getDecryptedDetails(
            to,
            encryptionKey,
            organisationType
          );
          for (let i = 0; i < paidTeammates.length; i++) {
            const {
              firstName,
              lastName,
              salaryAmount,
              salaryToken,
              address,
            } = paidTeammates[i];
            csvData.push({
              "First Name": firstName,
              "Last Name": lastName,
              "Salary Token": salaryToken,
              "Salary Amount": salaryAmount,
              Address: address,
              "Transaction Hash": transactionHash || "",
              "Created On": format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss"),
              "Transaction ID": transactionId,
              "Transaction fees": transactionFees ? transactionFees : "",
              Direction: direction,
              Origin: txOrigin,
            });
          }
        }
        setCsvData(csvData);
      }
    }
  }, [encryptionKey, organisationType, transactions]);

  return (
    <CSVLink
      data={csvData}
      filename={`transactions-${format(Date.now(), "dd/MM/yyyy-HH:mm:ss")}.csv`}
    >
      <Export>
        <div className="text">Export</div>
        <Img src={ExportIcon} alt="export" className="ml-2" />
      </Export>
    </CSVLink>
  );
}
