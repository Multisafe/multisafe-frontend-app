import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import SelectFromTeam from "./SelectFromTeam";

export const MODAL_NAME = "select-from-team-modal";

function SelectFromTeamModal(props) {
  const { show, handleHide, ...rest } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Select From Team"} toggle={handleHide} />
      <ModalBody width="110rem" minHeight="auto">
        <SelectFromTeam handleHide={handleHide} {...rest} />
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(SelectFromTeamModal);
