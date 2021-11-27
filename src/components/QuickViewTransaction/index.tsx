import React, { ReactNode, SyntheticEvent, useState } from "react";
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
import StatusText from "components/Transactions/StatusText";
import { TRANSACTION_MODES } from "constants/transactions";
import { TxDetails } from "store/multisig/types";
import { TransactionNote } from "components/Transactions/TransactionNote";
import TokenImg from "components/common/TokenImg";
import { UpdateLabels } from "./UpdateLabels";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  txDetails: TxDetails;
  navigateToTransaction?: () => void;
  transactionName?: ReactNode;
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

const TransactionHashContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const AmountContainer = styled.div`
  display: flex;
  gap: 1rem;
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
  transactionName,
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
    tokenCurrencies,
  } = txDetails;

  const renderOptionalCards = () => {
    switch (transactionMode) {
      case TRANSACTION_MODES.MASS_PAYOUT:
      case TRANSACTION_MODES.QUICK_TRANSFER:
      case TRANSACTION_MODES.APPROVE_AND_SWAP:
        return (
          <React.Fragment>
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
          <DetailsItem>
            <DetailsTitle>Allowance</DetailsTitle>
            <DetailsContent>US ${formatNumber(fiatValue)}</DetailsContent>
          </DetailsItem>
        );

      default:
        return fiatValue ? (
          <React.Fragment>
            <DetailsItem>
              <DetailsTitle>Total Amount</DetailsTitle>
              <AmountContainer>
                {tokenCurrencies && tokenCurrencies.length > 0 && (
                  <div className="amount">
                    {[...new Set(tokenCurrencies)].map((token) => (
                      <TokenImg token={token} key={token} />
                    ))}
                  </div>
                )}
                <DetailsContent>US ${formatNumber(fiatValue)}</DetailsContent>
              </AmountContainer>
            </DetailsItem>
          </React.Fragment>
        ) : null;
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
        {transactionName ? (
          <DetailsItem>
            <DetailsTitle>Transaction</DetailsTitle>
            <DetailsContent>{transactionName}</DetailsContent>
          </DetailsItem>
        ) : null}

        <DetailsItem>
          <DetailsTitle>Transaction Hash</DetailsTitle>
          {transactionHash ? (
            <TransactionHashContainer>
              <DetailsContent>{minifyAddress(transactionHash)}</DetailsContent>
              {/*@ts-ignore*/}
              <CopyButton
                id="address"
                tooltip="Transaction Hash"
                value={transactionHash}
              />
              {/*@ts-ignore*/}
              <EtherscanLink
                id="etherscan-link"
                type={ETHERSCAN_LINK_TYPES.TX}
                hash={transactionHash}
              />
            </TransactionHashContainer>
          ) : (
            <DetailsContent>-</DetailsContent>
          )}
        </DetailsItem>

        {renderOptionalCards()}

        {transactionFees > 0 ? (
          <DetailsItem>
            <DetailsTitle>Transaction Fee</DetailsTitle>
            <DetailsContent>
              ${formatNumber(transactionFees, 5)} ETH
            </DetailsContent>
          </DetailsItem>
        ) : null}

        <DetailsItem>
          <DetailsTitle>Created Date & Time</DetailsTitle>
          <DetailsContent>
            {createdOn && format(new Date(createdOn), "MMM-dd-yyyy HH:mm:ss")}
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
          <DetailsTitle>Labels</DetailsTitle>
          <UpdateLabels txDetails={txDetails} />
        </DetailsItem>

        <DetailsItem>
          <DetailsTitle>Note</DetailsTitle>
          <TransactionNote txDetails={txDetails} />
        </DetailsItem>
      </DetailsList>
    </SideDrawer>
  );
};
