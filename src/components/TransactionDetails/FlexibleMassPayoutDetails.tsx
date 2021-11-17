import React from "react";

import { Table, TableHead, TableBody } from "components/common/Table";
import {
  Accordion,
  AccordionItem,
  AccordionBody,
  AccordionHeader,
} from "components/common/Accordion";
import TokenImg from "components/common/TokenImg";
import { formatNumber } from "utils/number-helpers";
import Avatar from "components/common/Avatar";
import { DisbursementCard } from "./styles";

interface Receiver {
  name: string;
  address: string;
  tokenValue: string | number;
  fiatValue: string | number;
  departmentName: string;
}

interface Receivers extends Array<Receiver> {}

interface PaidTeammate {
  id: number;
  batchName?: string;
  tokenName: string;
  receivers: Receivers;
  tokenTotal: string | number;
  count: number;
}

interface PaidTeammates extends Array<PaidTeammate> {}

type Props = {
  paidTeammates: PaidTeammates;
};

function FlexibleMassPayoutDetails({ paidTeammates }: Props) {
  const renderTable = (receivers: Receivers, tokenName: string) => (
    <Table>
      <TableHead>
        <tr>
          <th style={{ width: "25%" }}>Name</th>
          <th style={{ width: "15%" }}>Team</th>
          <th style={{ width: "20%" }}>Disbursement</th>
          <th style={{ width: "40%" }}>Address</th>
        </tr>
      </TableHead>
      <TableBody style={{ maxHeight: "30rem", overflow: "auto" }}>
        {receivers.map(
          ({ name, address, tokenValue, fiatValue, departmentName }, idx) => {
            const firstName = name.split(" ")[0];
            const lastName = name.split(" ")[1];
            return (
              <tr key={`${idx}-${address}`}>
                <td style={{ width: "25%" }}>
                  <div className="d-flex align-items-center">
                    <Avatar
                      className="mr-3"
                      firstName={firstName}
                      lastName={lastName}
                    />
                    <div>{name}</div>
                  </div>
                </td>
                <td style={{ width: "15%" }}>{departmentName}</td>
                <td style={{ width: "20%" }}>
                  <TokenImg token={tokenName} />

                  {tokenName === "USD"
                    ? `${formatNumber(fiatValue)} USD (${formatNumber(
                        tokenValue,
                        5
                      )} ${tokenName})`
                    : `${formatNumber(tokenValue, 5)} ${tokenName}`}
                </td>
                <td style={{ width: "40%" }}>{address}</td>
              </tr>
            );
          }
        )}
      </TableBody>
    </Table>
  );

  const renderMultipleBatches = () => (
    <Accordion>
      {paidTeammates &&
        paidTeammates.map((summary: PaidTeammate, index) => {
          const { id, tokenName, receivers } = summary;

          return (
            <AccordionItem key={id} isOpen={index === 0}>
              <AccordionHeader>Batch {id + 1}</AccordionHeader>
              <AccordionBody>{renderTable(receivers, tokenName)}</AccordionBody>
            </AccordionItem>
          );
        })}
    </Accordion>
  );

  const renderSingleBatch = () => {
    if (!paidTeammates || !paidTeammates[0]) return null;

    const { id, tokenName, receivers } = paidTeammates[0];
    return (
      <DisbursementCard key={id}>
        <div className="title">Disbursement Details</div>
        {renderTable(receivers, tokenName)}
      </DisbursementCard>
    );
  };

  return paidTeammates.length > 1
    ? renderMultipleBatches()
    : renderSingleBatch();
}

export default FlexibleMassPayoutDetails;
