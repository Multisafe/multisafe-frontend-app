import { useDispatch } from "react-redux";
import { show } from "redux-modal";
import styled from "styled-components";

import NewTransferModal, {
  MODAL_NAME as NEW_TRANSFER_MODAL,
} from "components/NewTransfer/NewTransferModal";
// import AddFundsModal, {
//   MODAL_NAME as ADD_FUNDS_MODAL,
// } from "components/AddFunds";
import TransactionSubmittedModal from "components/NewTransfer/TransactionSubmittedModal";
import Img from "components/common/Img";
import NewIcon from "assets/icons/new-transfer/new-icon.svg";

const NewTransferButton = styled.div`
  min-height: 4rem;
  margin-right: 3rem;
  padding: 1.2rem;
  border-radius: 0.4rem;
  box-shadow: 1rem 1rem 2rem 0 rgba(77, 69, 164, 0.1);
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  width: 15rem;
  position: relative;
`;

const NewTransferText = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

const NewFeatureIcon = styled(Img)`
  position: absolute;
  right: -2rem;
  top: -2rem;
`;

export default function NewTransferDropdown() {
  const dispatch = useDispatch();

  const showNewTransferModal = () => {
    dispatch(show(NEW_TRANSFER_MODAL));
  };

  // const showAddFundsModal = () => {
  //   dispatch(show(ADD_FUNDS_MODAL));
  // };

  return (
    <NewTransferButton onClick={showNewTransferModal}>
      <NewTransferText>New Transfer</NewTransferText>
      <NewFeatureIcon src={NewIcon} alt="new" />

      <NewTransferModal />
      {/* <AddFundsModal /> */}
      <TransactionSubmittedModal />
    </NewTransferButton>
  );
}
