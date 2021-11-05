import { connectModal as reduxModal } from "redux-modal";
import { useDispatch } from "react-redux";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/FullPageModal";
import NewTransfer from "components/NewTransfer";
import { useInjectReducer } from "utils/injectReducer";
import newTransferReducer from "store/new-transfer/reducer";
import { setTransferSummary } from "store/new-transfer/actions";

export const MODAL_NAME = "new-transfer-modal";
const newTransferKey = "newTransfer";

function NewTransferModal(props) {
  const { show, handleHide } = props;

  useInjectReducer({ key: newTransferKey, reducer: newTransferReducer });

  const dispatch = useDispatch();

  const hideModal = async () => {
    // cleanup store on closing
    handleHide();
    await new Promise((resolve) =>
      setTimeout(() => resolve(dispatch(setTransferSummary([])), 10))
    );
  };

  return (
    <Modal isOpen={show} toggle={hideModal}>
      <ModalHeader toggle={hideModal} />
      <ModalBody width="120rem">
        <NewTransfer />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(NewTransferModal);
