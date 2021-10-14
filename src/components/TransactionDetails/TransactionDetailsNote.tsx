import React from "react";
import styled from "styled-components";
import { Input } from "../common/Form";
import Button from "components/common/Button";
import { TxDetails } from "components/Transactions/types";
import { useTransactionNote } from "hooks/useTransactionNote";

type Props = {
  txDetails: TxDetails;
};

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
`;

const ItemTitle = styled.div`
  font-size: 1.4rem;
  color: #989898;
`;

const NoteContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const TransactionDetailsNote = ({ txDetails }: Props) => {
  const { editedNote, onChange, onUpdateClick, disabled } =
    useTransactionNote(txDetails);

  return (
    <ItemContainer>
      <ItemTitle>Note</ItemTitle>
      <NoteContainer>
        <Input
          type="text"
          name="notes"
          id="notes"
          placeholder="Enter Note"
          value={editedNote}
          onChange={onChange}
        />
        <Button onClick={onUpdateClick} disabled={disabled}>
          Update
        </Button>
      </NoteContainer>
    </ItemContainer>
  );
};
