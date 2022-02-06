import { useEffect, useState } from "react";
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
import newStreamReducer from "store/new-stream/reducer";
import ExitModal, { MODAL_NAME as EXIT_MODAL } from "./ExitModal";
import { resetTransferStore } from "store/new-transfer/actions";
import { toaster } from "components/common/Toast";
import NewTransferPicker from "./NewTransferPicker";
import StreamModal from "components/NewTransfer/Stream/NewStream";
import Button from "components/common/Button";
import { STEPS } from "store/register/resources";

export const MODAL_NAME = "new-transfer-modal";
const newTransferKey = "newTransfer";
const newStreamKey = "newStream";

type Props = InjectedProps & { prefilledValues: FixMe };

function NewTransferModal(props: Props) {
  const { show, ...rest } = props;

  useInjectReducer({ key: newTransferKey, reducer: newTransferReducer });
  useInjectReducer({ key: newStreamKey, reducer: newStreamReducer });

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

  const [transferType, chooseTransferType] = useState(STEPS.ZERO);

  const getModalContent = (transferType: number) => {
    switch (transferType) {
      case STEPS.ONE:
        return <NewTransfer {...rest} />;
      case STEPS.TWO:
        return <StreamModal {...rest} />;
      default:
        return <NewTransferPicker chooseTransferType={chooseTransferType} />;
    }
  };

  return (
    <Modal isOpen={show} toggle={hideModal}>
      <ModalHeader toggle={hideModal} />
      <ModalBody>
        <>
          <Button
            onClick={() => {
              chooseTransferType(STEPS.ZERO);
            }}
          >
            Cancel
          </Button>
        </>
        {getModalContent(transferType)}
        <ExitModal />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(NewTransferModal);
