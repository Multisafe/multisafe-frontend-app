import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// import { Status } from "./styles";
import { Card } from "components/common/Card";

export default function CompleteSetup() {
  return (
    <div className="status">
      <Card className="p-4" style={{ width: "33em" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Complete Setup</div>
            <div className="card-subtitle">Invite all the owners to Parcel</div>
          </div>
          <Link to="/dashboard/invite">
            <div className="circle">
              <FontAwesomeIcon icon={faArrowRight} color="#fff" />
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
