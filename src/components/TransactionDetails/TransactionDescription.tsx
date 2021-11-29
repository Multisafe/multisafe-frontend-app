import React from "react";
import { DescriptionCard } from "./styles";

type Props = {
  decryptedDetails: FixMe;
  decryptedDescription: string;
};

const DEFAULT_DESCRIPTION = "No description given...";

export const TransactionDescription = ({
  decryptedDetails,
  decryptedDescription,
}: Props) => {
  const description =
    decryptedDescription ||
    decryptedDetails?.description ||
    decryptedDetails?.[0]?.description ||
    DEFAULT_DESCRIPTION;

  return (
    <DescriptionCard>
      <div className="title">Description</div>
      <div className="subtitle">{description}</div>
    </DescriptionCard>
  );
};
