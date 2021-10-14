import React, { SyntheticEvent, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import CopyButton from "components/common/Copy";
import EtherscanLink from "components/common/EtherscanLink";
import {
  ETHERSCAN_LINK_TYPES,
  minifyAddress,
} from "components/common/Web3Utils";
import { SideDrawer } from "components/common/SideDrawer";
import { formatNumber } from "utils/number-helpers";
import StatusText from "./StatusText";
import { TRANSACTION_MODES } from "constants/transactions";
import { TxDetails } from "./types";
import { TransactionNote } from "./TransactionNote";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txDetails: TxDetails;
  navigateToTransaction?: () => void;
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MoreLink = styled.div`
  color: #1452f5;
  cursor: pointer;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 0;
  gap: 3rem;
`;

const DetailsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 3rem;
`;

const DetailsTitle = styled.div`
  font-size: 1.4rem;
  color: #989898;
`;

const DetailsContent = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const useQuickViewTransactionState = () => {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const onQuickViewOpen = (e: SyntheticEvent) => {
    setQuickViewOpen(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const onQuickViewClose = () => {
    setQuickViewOpen(false);
  };

  return {
    quickViewOpen,
    onQuickViewOpen,
    onQuickViewClose,
  };
};

export const QuickViewTransaction = ({
  isOpen,
  onClose,
  txDetails,
  navigateToTransaction,
}: Props) => {
  const {
    transactionHash,
    transactionFees,
    status,
    createdOn,
    transactionMode,
    tokenValue,
    tokenCurrency,
    fiatValue,
  } = txDetails;

  const renderOptionalCards = () => {
    switch (transactionMode) {
      case TRANSACTION_MODES.MASS_PAYOUT:
      case TRANSACTION_MODES.QUICK_TRANSFER:
        return (
          <React.Fragment>
            {/*<DetailsItem>*/}
            {/*  <DetailsTitle>Paid To</DetailsTitle>*/}
            {/*  <DetailsContent>*/}
            {/*    {paidTeammates && paidTeammates.length} people*/}
            {/*  </DetailsContent>*/}
            {/*</DetailsItem>*/}

            <DetailsItem>
              <DetailsTitle>Total Amount</DetailsTitle>
              <DetailsContent>
                US ${formatNumber(fiatValue)} ({formatNumber(tokenValue, 5)}{" "}
                {tokenCurrency})
              </DetailsContent>
            </DetailsItem>
          </React.Fragment>
        );

      case TRANSACTION_MODES.SPENDING_LIMITS:
        return (
          <div className="detail-card">
            <div className="detail-title">Allowance</div>
            <div className="detail-subtitle">US ${formatNumber(fiatValue)}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SideDrawer
      right
      width={380}
      header={
        <HeaderContainer>
          <div>Transaction Details</div>
          {navigateToTransaction ? (
            <MoreLink onClick={navigateToTransaction}>More Details</MoreLink>
          ) : null}
        </HeaderContainer>
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <DetailsList>
        <DetailsItem>
          <DetailsTitle>Transaction Hash</DetailsTitle>
          {transactionHash ? (
            <React.Fragment>
              <DetailsContent>{minifyAddress(transactionHash)}</DetailsContent>
              <IconsContainer>
                {/*@ts-ignore*/}
                <CopyButton
                  id="address"
                  tooltip="Transaction Hash"
                  value={transactionHash}
                  className="mr-3"
                />
                {/*@ts-ignore*/}
                <EtherscanLink
                  id="etherscan-link"
                  type={ETHERSCAN_LINK_TYPES.TX}
                  hash={transactionHash}
                />
              </IconsContainer>
            </React.Fragment>
          ) : (
            <DetailsContent>-</DetailsContent>
          )}
        </DetailsItem>

        {renderOptionalCards()}

        <DetailsItem>
          <DetailsTitle>Transaction Fee</DetailsTitle>
          <DetailsContent>
            {transactionFees > 0
              ? `${formatNumber(transactionFees, 5)} ETH`
              : `-`}
          </DetailsContent>
        </DetailsItem>

        <DetailsItem>
          <DetailsTitle>Created Date & Time</DetailsTitle>
          <DetailsContent>
            {createdOn && format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
          </DetailsContent>
        </DetailsItem>

        <DetailsItem>
          <DetailsTitle>Status</DetailsTitle>
          <DetailsContent>
            {/*@ts-ignore*/}
            <StatusText status={status} />
          </DetailsContent>
        </DetailsItem>

        <DetailsItem>
          <DetailsTitle>Note</DetailsTitle>
          <TransactionNote txDetails={txDetails} />
        </DetailsItem>
      </DetailsList>
    </SideDrawer>
  );
};
