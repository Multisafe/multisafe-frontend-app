import React from "react";
import { DescriptionCard } from "./styles";

type Props = {
  decryptedDetails: FixMe;
};

const DEFAULT_DESCRIPTION = "No description given...";

export const TransactionDescription = ({ decryptedDetails }: Props) => {
  const description = decryptedDetails?.[0]?.description || DEFAULT_DESCRIPTION;

  return (
    <DescriptionCard>
      <div className="title">Description</div>
      <div className="subtitle">{description}</div>
    </DescriptionCard>
  );
};
