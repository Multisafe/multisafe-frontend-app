import React from 'react';
import {TRANSACTION_MODES} from 'constants/transactions';
import {DescriptionCard} from './styles';

type Props = {
  decryptedDetails: FixMe,
  transactionMode: number,
  metaData: FixMe
}

const getDescription = (description: string, transactionMode: number, metaData: FixMe) => {
  if (!metaData) return description;

  switch (transactionMode) {
    case TRANSACTION_MODES.CHANGE_THRESHOLD:
      const { threshold, newThreshold, safeOwners } = metaData;
      return <div>Changing safe signature threshold from {threshold}/{safeOwners} to {newThreshold}/{safeOwners}</div>;

    default:
      return description;
  }
}

export const TransactionDescription = ({decryptedDetails, transactionMode, metaData}: Props) => {
  const description = decryptedDetails?.[0]?.description || 'No description given...';

  return (
    <DescriptionCard>
      <div className="title">Description</div>
      <div className="subtitle">
        {getDescription(description, transactionMode, metaData)}
      </div>
    </DescriptionCard>
  )
}
