import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { useSelector } from "react-redux";

import Img from "components/common/Img";
import ExportIcon from "assets/icons/dashboard/export-icon.svg";
import { Export } from "./styles";
import { getDecryptedDetails } from "utils/encryption";
import { makeSelectOrganisationType } from "store/global/selectors";
import { useLocalStorage } from "hooks";
import { makeSelectPeople } from "store/view-people/selectors";

export default function ExportButton() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [csvData, setCsvData] = useState([]);

  const teammates = useSelector(makeSelectPeople());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    let csvData = [];
    if (teammates && teammates.length > 0) {
      for (let i = 0; i < teammates.length; i++) {
        const { data, departmentName } = teammates[i];
        const teammateDetails = getDecryptedDetails(
          data,
          encryptionKey,
          organisationType
        );
        const {
          firstName,
          lastName,
          salaryAmount,
          salaryToken,
          address,
        } = teammateDetails;
        csvData.push({
          "First Name": firstName,
          "Last Name": lastName,
          Address: address,
          Amount: salaryAmount,
          Token: salaryToken,
          Team: departmentName,
        });
      }
    }
    setCsvData(csvData);
  }, [encryptionKey, organisationType, teammates]);

  return (
    <CSVLink
      uFEFF={false}
      data={csvData}
      filename={`people-${format(Date.now(), "dd/MM/yyyy-HH:mm:ss")}.csv`}
    >
      <Export>
        <div className="text">Export</div>
        <Img src={ExportIcon} alt="export" className="ml-2" />
      </Export>
    </CSVLink>
  );
}
