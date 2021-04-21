import React from "react";
import { Col, Row } from "reactstrap";

import { Info } from "components/Dashboard-old/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";

import { TransactionUrl } from "components/common/Web3Utils";
import TransactionSubmittedPng from "assets/images/transaction-submitted.png";

import { Container, Title, Heading, Text } from "./styles";
export default function TransactionSubmitted({
  txHash,
  selectedCount,
  clearTxHash,
  transactionId,
}) {
  return (
    <div
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <Info />
      <Container>
        <Card className="payment-success">
          <div className="text-center">
            <img src={TransactionSubmittedPng} alt="submitted" width="150" />
          </div>
          <Title className="mb-2" style={{ marginTop: "40px" }}>
            Transaction Submitted
          </Title>
          <Heading>
            {selectedCount
              ? `We are processing the payment of ${selectedCount} people. You can
            track the status of your payment in the transactions section.`
              : "You can track the status of your transction in the transactions section."}
          </Heading>
          <Text>
            <TransactionUrl hash={txHash} />
          </Text>

          <Row style={{ marginTop: "150px" }}>
            <Col lg="6" sm="12" className="pr-0">
              <Button large type="button" className="secondary" to="/dashboard">
                Back to Dashboard
              </Button>
            </Col>
            <Col lg="6" sm="12">
              <Button
                large
                type="button"
                to={`/dashboard/transactions/${transactionId}`}
                onClick={() => clearTxHash && clearTxHash()}
              >
                Track Status
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}
