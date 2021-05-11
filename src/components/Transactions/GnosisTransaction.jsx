import React from "react";
import { format } from "date-fns";

import StatusText from "./StatusText";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import OutgoingIcon from "assets/icons/dashboard/outgoing.svg";
import { TxRow } from "./styles";
import Img from "components/common/Img";
import { TX_DIRECTION } from "store/transactions/constants";

export default function GnosisTransaction({ transaction }) {
  const { direction, txDetails } = transaction;

  const { status, createdOn } = txDetails;
  return (
    <TxRow>
      <td style={{ width: "35%" }}>
        {/* https://getbootstrap.com/docs/4.3/utilities/stretched-link/ */}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content*/}
        <a
          href={txDetails.txLink}
          rel="noreferrer noopener"
          target="blank"
          className="stretched-link"
        ></a>
        <div className="d-flex align-items-center">
          <Img
            src={
              direction === TX_DIRECTION.INCOMING ? IncomingIcon : OutgoingIcon
            }
            alt={direction}
            className="direction"
          />
          <div>
            <div className="name">Gnosis</div>
            <div className="date">
              {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
            </div>
          </div>
        </div>
      </td>
      <td style={{ width: "30%" }}>
        <div className="amount">-</div>
      </td>
      <td style={{ width: "23%" }}>
        <StatusText status={status} textOnly />
      </td>
      <td style={{ width: "12%" }}>
        <div className="view">View</div>
      </td>
    </TxRow>
  );
}
