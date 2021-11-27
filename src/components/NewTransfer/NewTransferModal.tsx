import { useEffect } from "react";
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
import { resetTransferStore } from "store/new-transfer/actions";
import { toaster } from "components/common/Toast";

export const MODAL_NAME = "new-transfer-modal";
const newTransferKey = "newTransfer";

type Props = InjectedProps & { prefilledValues: FixMe };

function NewTransferModal(props: Props) {
  const { show, ...rest } = props;

  useInjectReducer({ key: newTransferKey, reducer: newTransferReducer });

  const dispatch = useDispatch();

  const hideModal = async () => {
    dispatch(showModal(EXIT_MODAL));
  };

  useEffect(() => {
    return () => {
      toaster.dismiss();
      dispatch(resetTransferStore());
    };
  }, [dispatch]);

  return (
    <Modal isOpen={show} toggle={hideModal}>
      <ModalHeader toggle={hideModal} />
      <ModalBody width="120rem">
        <NewTransfer {...rest} />
        <ExitModal />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(NewTransferModal);
