import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// import { Status } from "./styles";
import { Card } from "components/common/Card";

export default function QuickTransferCard() {
  return (
    <div className="status">
      <Card className="p-4" style={{ width: "33em" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Quick Transfer</div>
            <div className="card-subtitle">Send money quickly to anyone</div>
          </div>
          <Link to="/dashboard/quick-transfer">
            <div className="circle">
              <FontAwesomeIcon icon={faArrowRight} color="#fff" />
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
