import React from "react";
import { ModalHeader, ModalBody } from "reactstrap";

import { Card } from "components/common/Card";
import Img from "../Img";
import CloseIcon from "assets/icons/dashboard/close-icon.svg";

import { Modal } from "./styles";

const modalStyles = `
  .modal-content {
    border: none;
    background: none;
    margin: auto;
    width: fit-content;
  }

  .modal-dialog {
    max-width: 100% !important;
  }

  .modal-open .modal {
    backdrop-filter: blur(4rem);
  }

  .modal-title {
    width: 100%;
  }

  .modal-header {
    padding: 1rem 1rem 1.5rem;
  }

  .modal-body {
    padding-top: 0;
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

function CustomModalHeader({ children, title, toggle, ...rest }) {
  return (
    <ModalHeader style={{ borderBottom: "none" }} {...rest}>
      <div className="header-flex">
        <div>{title}</div>
        <div onClick={toggle} className="close-btn">
          <Img src={CloseIcon} alt="close" />
        </div>
      </div>
      {children}
    </ModalHeader>
  );
}

function CustomModalBody({ children, width, ...rest }) {
  return (
    <ModalBody {...rest}>
      <Card
        className="position-relative p-0 modal-card"
        style={{ width: width || "100%" }}
      >
        {children}
      </Card>
    </ModalBody>
  );
}

export {
  CustomModal as Modal,
  CustomModalHeader as ModalHeader,
  CustomModalBody as ModalBody,
};
