import { ModalHeader, ModalBody } from "reactstrap";

import Img from "../Img";
import CloseIcon from "assets/icons/dashboard/close-icon.svg";
import { ModalProps, ModalBodyProps } from "./types";

import { SimpleModal as Modal } from "./styles";

const modalStyles = `
  .simple-modal-content {
    border: solid 0.1rem #aaaaaa;
    background: #ffffff;
    margin: auto;
    max-width: 55rem;
  }

  .simple-modal-dialog {
    max-width: 100% !important;
  }

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    .modal-open .modal {
     -webkit-backdrop-filter: blur(4rem);
     backdrop-filter: blur(4rem);
    }
  }

 @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    .modal-open .modal {
     background-color: rgba(255, 255, 255, .875);
    }
  }


  .simple-modal-wrapper .modal-backdrop.show {
    opacity: 0.1;
  }

  .modal-title {
    width: 100%;
  }

  .simple-modal-header {
    padding: 2rem 2rem 0;
    border-bottom: 0;
  }

  .simple-modal-body {
    padding: 0 3rem 3rem;
  }

  .simple-modal-backdrop.show {
    opacity: 0.1;
  }
`;

function CustomModal({ children, isOpen, toggle, ...rest }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      centered
      toggle={toggle}
      fade={false}
      wrapClassName="simple-modal-wrapper"
      contentClassName="simple-modal-content"
      {...rest}
    >
      <style>{modalStyles}</style>
      {children}
    </Modal>
  );
}

function CustomModalHeader({ children, toggle, ...rest }: ModalProps) {
  return (
    <ModalHeader className="simple-modal-header" {...rest}>
      <div onClick={toggle} className="close-btn">
        <Img src={CloseIcon} alt="close" />
      </div>
      {children}
    </ModalHeader>
  );
}

function CustomModalBody({ children, ...rest }: ModalBodyProps) {
  return (
    <ModalBody className="simple-modal-body" {...rest}>
      {children}
    </ModalBody>
  );
}

export {
  CustomModal as Modal,
  CustomModalHeader as ModalHeader,
  CustomModalBody as ModalBody,
};
