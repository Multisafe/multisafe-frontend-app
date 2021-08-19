import React from "react";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import Step1Icon from "assets/icons/invite/step-1.svg";
import Step2Icon from "assets/icons/invite/step-2.svg";
import Step3Icon from "assets/icons/invite/step-3.svg";
import { InvitationSteps } from "./styles";
import Img from "components/common/Img";

export const MODAL_NAME = "how-invitation-works-modal";

const invitationSteps = [
  {
    title: "STEP 1",
    subtitle: "Invite the owners to Multisafe",
    icon: Step1Icon,
  },
  {
    title: "STEP 2",
    subtitle: "Owner accepts the invite",
    icon: Step2Icon,
  },
  {
    title: "STEP 3",
    subtitle: "You give final approval to the owner",
    icon: Step3Icon,
  },
];

function InvitationStepsModal(props) {
  const { show, handleHide } = props;

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"How invitation works"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <InvitationSteps>
          <div className="title">Owners</div>
          <div className="subtitle">
            To allow other owners to use Multisafe, follow these simple steps.
          </div>
          <div className="steps-container">
            {invitationSteps.map(({ title, subtitle, icon }) => (
              <div className="step" key={title}>
                <div>
                  <Img src={icon} alt={title} />
                </div>
                <div>
                  <div className="step-title">{title}</div>
                  <div className="step-subtitle">{subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </InvitationSteps>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(InvitationStepsModal);
