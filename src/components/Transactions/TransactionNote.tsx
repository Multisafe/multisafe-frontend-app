import React from "react";
import styled from "styled-components";
import { TxDetails } from "./types";
import {Input} from "../common/Form";
import StyledTextArea from "../common/Form/styles/TextArea";
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
  align-items: center;
`;

const NoteError = styled.div`
  color: #ff4660;
  font-size: 1.6rem;
`;

const NoteSuccess = styled.div`
  color: #6cb44c;
  font-size: 1.6rem;
`;

export const TransactionNote = ({ txDetails }: Props) => {
  const { editedNote, onChange, onUpdateClick, loading, disabled, error, success } =
    useTransactionNote(txDetails);

  const renderInfo = () => {
    if (error) {
      return <NoteError>{error}</NoteError>
    } else if (success) {
      return <NoteSuccess>{success}</NoteSuccess>
    } else {
      return <div/>
    }
  };

  return (
    <NoteContainer>
      <StyledTextArea
        name="name"
        placeholder="Enter Note"
        rows={2}
        value={editedNote}
        onChange={onChange}
      />
      <ControlContainer>
        {renderInfo()}
        <Button onClick={onUpdateClick} disabled={disabled} loading={loading}>
          Update
        </Button>
      </ControlContainer>
    </NoteContainer>
  );
};
