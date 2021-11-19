import React from "react";
import { ModalHeader, ModalBody } from "reactstrap";

import Img from "../Img";
import CloseIcon from "assets/icons/dashboard/close-icon.svg";
import { ModalProps, ModalBodyProps } from "./types";
import GradientImg from "assets/icons/new-transfer/gradient.svg";

import { SimpleModal as Modal } from "./styles";

const modalStyles = `
  .full-modal-content {
    border: none;
    border-radius: 0;
    background: #ffffff;
    margin: auto;
    width: 100%;
    min-height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(${GradientImg});
  }

  .modal-title {
    width: 100%;
  }

  .full-modal-header {
    padding: 4rem 4rem 0;
    border-bottom: 0;
  }

  .full-modal-body {
    padding: 0;
  }

  .full-modal-wrapper .modal-dialog {
    margin: 0;
    max-width: 100% !important;
  }
`;

function CustomModal({ children, isOpen, toggle, ...rest }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      centered
      toggle={toggle}
      backdrop={false}
      fade={false}
      wrapClassName="full-modal-wrapper"
      contentClassName="full-modal-content"
      style={{
        backgroundImage: `url(${GradientImg})`,
      }}
      {...rest}
    >
      <style>{modalStyles}</style>
      {children}
    </Modal>
  );
}

function CustomModalHeader({ children, toggle, ...rest }: ModalProps) {
  return (
    <ModalHeader className="full-modal-header" {...rest}>
      <div onClick={toggle} className="close-btn">
        <Img src={CloseIcon} alt="close" />
      </div>
      {children}
    </ModalHeader>
  );
}

function CustomModalBody({ children, width, ...rest }: ModalBodyProps) {
  return (
    <ModalBody className="full-modal-body" {...rest}>
      {children}
    </ModalBody>
  );
}

export {
  CustomModal as Modal,
  CustomModalHeader as ModalHeader,
  CustomModalBody as ModalBody,
};
