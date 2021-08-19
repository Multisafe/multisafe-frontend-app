import React from "react";
import { ModalHeader, ModalBody } from "reactstrap";

import Img from "../Img";
import CloseIcon from "assets/icons/dashboard/close-icon.svg";

import { SimpleModal as Modal } from "./styles";

const modalStyles = `
  .modal-content {
    border: solid 0.1rem #aaaaaa;
    background: #ffffff;
    margin: auto;
    max-width: 55rem;
  }

  .modal-dialog {
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

  .modal-title {
    width: 100%;
  }

  .modal-header {
    padding: 2rem 2rem 0;
  }

  .modal-body {
    padding: 0 3rem 3rem;
  }

  .modal-backdrop.show {
    opacity: 0.1;
  }
`;

function CustomModal({ children, isOpen, toggle, ...rest }) {
  return (
    <Modal isOpen={isOpen} centered toggle={toggle} backdrop={true} {...rest}>
      <style>{modalStyles}</style>
      {children}
    </Modal>
  );
}

function CustomModalHeader({ children, toggle, ...rest }) {
  return (
    <ModalHeader style={{ borderBottom: "none" }} {...rest}>
      <div onClick={toggle} className="close-btn">
        <Img src={CloseIcon} alt="close" />
      </div>
      {children}
    </ModalHeader>
  );
}

function CustomModalBody({ children, width, ...rest }) {
  return <ModalBody {...rest}>{children}</ModalBody>;
}

export {
  CustomModal as Modal,
  CustomModalHeader as ModalHeader,
  CustomModalBody as ModalBody,
};
