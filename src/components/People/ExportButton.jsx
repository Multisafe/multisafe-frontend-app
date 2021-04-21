import React from "react";

import Img from "components/common/Img";
import ExportIcon from "assets/icons/dashboard/export-icon.svg";
import { Export } from "./styles";

export default function ExportButton() {
  const handleExport = () => {
    console.log("export");
  };

  return (
    <Export onClick={handleExport}>
      <div className="text">Export</div>
      <Img src={ExportIcon} alt="export" className="ml-2" />
    </Export>
  );
}
