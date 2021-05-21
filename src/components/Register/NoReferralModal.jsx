import { useState, useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";
import { useLocation } from "react-router-dom";

import NotFoundPng from "assets/images/not-found.png";

import { NoReferral } from "./styles";

const NoReferralModal = () => {
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralId = searchParams.get("referralId");
    if (!referralId) setShow(true);
    else setShow(false);
  }, [location]);

  return (
    <Modal isOpen={show} centered>
      <ModalBody>
        <NoReferral>
          <div className="text-center">
            <div className="pb-4">
              <img src={NotFoundPng} alt="error" width="300" className="mb-4" />
            </div>
            <h4 className="title pb-3">Oops, you do not have an invite!</h4>
            <div className="subtitle">
              This is the alpha version of Multisafe, and users can join only
              via invite link.
            </div>
          </div>
        </NoReferral>
      </ModalBody>
    </Modal>
  );
};

export default NoReferralModal;
