import React, { useEffect } from "react";
import styled from "styled-components/macro";
import Button from "components/common/Button";
import { TxDetails } from "store/multisig/types";
import { useTransactionNote } from "hooks/useTransactionNote";
import {
  QuickViewTransaction,
  useQuickViewTransactionState,
} from "components/QuickViewTransaction";
import Img from "components/common/Img";
import EditNoteIcon from "assets/icons/dashboard/edit-note-icon.svg";
import { useInjectReducer } from "utils/injectReducer";
import { MULTISIG_KEY } from "store/multisig/constants";
import multisigReducer from "store/multisig/reducer";
import { useInjectSaga } from "utils/injectSaga";
import multisigSaga from "store/multisig/saga";
import { useActiveWeb3React } from "hooks";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getLabels } from "store/multisig/actions";
import { TransactionLabels } from "components/Transactions/TransactionLabels";

type Props = {
  txDetails: TxDetails;
};

const ItemContainer = styled.div`
  padding: 1.2rem;
  border: solid 0.1rem #aba4f6;
  border-radius: 0.2rem;
  background-color: white;
  display: flex;
  gap: 3rem;
  flex-grow: 1;
  justify-content: space-between;
`;

const ItemTitle = styled.div`
  font-size: 1.2rem;
  color: #989898;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NoteContent = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  flex-grow: 1;
`;

const EditButton = styled(Button)`
  padding: 1rem;

  &:hover {
    opacity: 0.7;
  }
`;

const AddNoteMessage = styled.div`
  font-size: 1.4rem;
  color: #989898;
  font-weight: 700;
`;

export const TransactionDetailsNote = ({ txDetails }: Props) => {
  const dispatch = useDispatch();
  const { editedNote } = useTransactionNote(txDetails);
  const { account: userAddress } = useActiveWeb3React();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  const { quickViewOpen, onQuickViewOpen, onQuickViewClose } =
    useQuickViewTransactionState();

  //@ts-ignore
  useInjectReducer({ key: MULTISIG_KEY, reducer: multisigReducer });
  //@ts-ignore
  useInjectSaga({ key: MULTISIG_KEY, saga: multisigSaga });

  useEffect(() => {
    dispatch(getLabels(safeAddress, userAddress));
  }, [dispatch, safeAddress, userAddress]);

  return (
    <React.Fragment>
      <ItemContainer>
        <ContentContainer>
          <ItemTitle>Note</ItemTitle>
          {editedNote ? (
            <NoteContent>{editedNote}</NoteContent>
          ) : (
            <AddNoteMessage>Add Note</AddNoteMessage>
          )}
        </ContentContainer>
        <EditButton iconOnly onClick={onQuickViewOpen}>
          <Img src={EditNoteIcon} alt="edit-note" width="16" />
        </EditButton>
      </ItemContainer>
      <ItemContainer>
        <ContentContainer>
          <ItemTitle>Label</ItemTitle>
          {txDetails.labels.length ? (
            <TransactionLabels labels={txDetails.labels} />
          ) : (
            <AddNoteMessage>Add Labels</AddNoteMessage>
          )}
        </ContentContainer>
        <EditButton iconOnly onClick={onQuickViewOpen}>
          <Img src={EditNoteIcon} alt="edit-note" width="16" />
        </EditButton>
      </ItemContainer>
      <QuickViewTransaction
        {...{
          isOpen: quickViewOpen,
          onClose: onQuickViewClose,
          txDetails,
        }}
      />
    </React.Fragment>
  );
};
