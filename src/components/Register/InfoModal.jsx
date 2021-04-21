import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { PopupContainer } from "./styles";

export const MODAL_NAME = "organisation-info-modal";

const OrganisationInfoModal = (props) => {
  const { handleHide, show, info } = props;

  return (
    <Modal isOpen={show} centered style={{ minWidth: "700px" }}>
      <PopupContainer>
        <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
          <div className="popup-title">{info && info.name}</div>
          <div className="popup-subtitle">{info && info.subtitle}</div>
        </ModalHeader>
        <ModalBody>
          <ul className="popup-list">
            {info &&
              info.points.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
        </ModalBody>
      </PopupContainer>
    </Modal>
  );
};

export default reduxModal({ name: MODAL_NAME })(OrganisationInfoModal);
