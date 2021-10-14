import React from "react";
import styled from "styled-components";
import { TxDetails } from "./types";
import { Input } from "../common/Form";
import Button from "components/common/Button";
import { useTransactionNote } from "hooks/useTransactionNote";

type Props = {
  txDetails: TxDetails;
};

const NoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TransactionNote = ({ txDetails }: Props) => {
  const { editedNote, onChange, onUpdateClick, loading, disabled, error } =
    useTransactionNote(txDetails);

  return (
    <NoteContainer>
      <Input
        type="text"
        name="notes"
        id="notes"
        placeholder="Enter Note"
        value={editedNote}
        onChange={onChange}
      />
      <ControlContainer>
        <div>{error || null}</div>
        <Button onClick={onUpdateClick} disabled={disabled} loading={loading}>
          Update
        </Button>
      </ControlContainer>
    </NoteContainer>
  );
};
