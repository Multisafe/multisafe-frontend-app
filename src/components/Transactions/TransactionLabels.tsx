import React from "react";
import { Label } from "store/multisig/types";
import styled from "styled-components";

type Props = {
  labels: Label[];
};

const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const LabelBlock = styled.div`
  padding: 0.6rem 1rem;
  border-radius: 4px;
`;

const AddLabel = styled.div`
  font-size: 1.4rem;
  color: #989898;
`;

export const TransactionLabels = ({ labels }: Props) => {
  return labels?.length ? (
    <LabelsContainer>
      {labels.map(({ labelId, name, colorCode }) => (
        <LabelBlock key={labelId} style={{ backgroundColor: colorCode }}>
          {name}
        </LabelBlock>
      ))}
    </LabelsContainer>
  ) : (
    <AddLabel>Add Label</AddLabel>
  );
};
