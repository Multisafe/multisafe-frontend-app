import { connectModal as reduxModal } from "redux-modal";
import { useDispatch } from "react-redux";
import { show as showModal, InjectedProps } from "redux-modal";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/FullPageModal";
import NewTransfer from "components/NewTransfer";
import { useInjectReducer } from "utils/injectReducer";
import newTransferReducer from "store/new-transfer/reducer";
import ExitModal, { MODAL_NAME as EXIT_MODAL } from "./ExitModal";
export const MODAL_NAME = "new-transfer-modal";
const newTransferKey = "newTransfer";

function NewTransferModal(props: InjectedProps) {
  const { show } = props;

  useInjectReducer({ key: newTransferKey, reducer: newTransferReducer });

  const dispatch = useDispatch();

  const hideModal = async () => {
    dispatch(showModal(EXIT_MODAL));
  };

  return (
    <Modal isOpen={show} toggle={hideModal}>
      <ModalHeader toggle={hideModal} />
      <ModalBody width="120rem">
        <NewTransfer />
        <ExitModal />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(NewTransferModal);
