import { ModalHeader, ModalBody } from "reactstrap";

import { Card } from "components/common/Card";
import Img from "../Img";
import CloseIcon from "assets/icons/dashboard/close-icon.svg";
import { ModalProps, ModalBodyProps } from "./types";

import { Modal } from "./styles";

const modalStyles = `
  .modal-title {
    width: 100%;
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


  .common-modal-wrapper .modal-backdrop.show {
    opacity: 0.1;
  }

  .common-modal-content {
    border: none;
    background: none;
    margin: auto;
    width: fit-content;
    width: -moz-fit-content;
  }

  .modal-title {
    width: 100%;
  }

  .common-modal-header {
    padding: 1rem 1rem 1.5rem;
    border-bottom: 0;
  }

  .common-modal-body {
    padding-top: 0;
  }

  .common-modal-wrapper .modal-dialog {
    max-width: 100%;
  }
`;

function CustomModal({ children, isOpen, toggle, ...rest }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      centered
      toggle={toggle}
      backdrop={true}
      {...rest}
      contentClassName="common-modal-content"
      wrapClassName="common-modal-wrapper"
    >
      <style>{modalStyles}</style>
      {children}
    </Modal>
  );
}

function CustomModalHeader({
  children = null,
  title,
  toggle,
  ...rest
}: ModalProps & { title: string }) {
  return (
    <ModalHeader className="common-modal-header" {...rest}>
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

function CustomModalBody({
  children,
  width,
  minHeight,
  ...rest
}: ModalBodyProps) {
  return (
    <ModalBody className="common-modal-body" {...rest}>
      <Card
        className="position-relative p-0 modal-card"
        style={{ width: width || "100%", minHeight: minHeight || "30rem" }}
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
