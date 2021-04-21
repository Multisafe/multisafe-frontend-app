import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";

import CopyButton from "components/common/Copy";
import { minifyAddress } from "components/common/Web3Utils";
import TeamPng from "assets/images/user-team.png";

import { Title, Heading, Summary } from "./styles";
import { Circle } from "components/Header/styles";

export const MODAL_NAME = "teammate-details-modal";

const modalStyles = `
  .modal-content {
    border-radius: 20px;
    border: none;
    padding: 20px;
  }
`;

function TeammateDetailsModal(props) {
  const {
    show,
    handleHide,
    firstName,
    lastName,
    departmentName,
    salary,
    currency,
    address,
  } = props;
  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Teammate</Title>
        <Heading>Here are his details</Heading>
      </ModalHeader>
      <Summary className="mb-3 mx-auto" style={{ maxWidth: "420px" }}>
        <div className="left">
          <img src={TeamPng} alt="teammate" width="80" />
        </div>
        <div className="right">
          <div className="mb-3">
            <div className="section-title mb-1">Name</div>
            <div className="section-desc">
              {firstName} {lastName}
            </div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Team</div>
            <div className="section-desc">{departmentName}</div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Pay Amount</div>
            <div className="section-desc">
              {salary} {currency}
            </div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Wallet Address</div>
            <div className="section-desc d-flex align-items-center">
              <p>{minifyAddress(address)}</p>
              <Circle
                className="ml-3"
                style={{ height: "30px", width: "30px" }}
              >
                <CopyButton
                  id="address"
                  tooltip="teammate address"
                  value={address || ""}
                />
              </Circle>
            </div>
          </div>
        </div>
      </Summary>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(TeammateDetailsModal);
