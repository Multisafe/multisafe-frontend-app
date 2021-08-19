import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/SimpleModal";
import { connectModal as reduxModal } from "redux-modal";
import { PopupContainer } from "./styles";

export const MODAL_NAME = "organisation-info-modal";

const OrganisationInfoModal = (props) => {
  const { handleHide, show, info } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title text-primary">{info && info.name}</div>
        <div className="subtitle">{info && info.subtitle}</div>
        <PopupContainer>
          <ul className="popup-list">
            {info &&
              info.points.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
        </PopupContainer>
      </ModalBody>
    </Modal>
  );
};

export default reduxModal({ name: MODAL_NAME })(OrganisationInfoModal);
