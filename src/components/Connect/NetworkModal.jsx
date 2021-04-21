import { useState, useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";

import { findNetworkNameByWeb3ChainId } from "constants/networks";
import NotFoundPng from "assets/images/not-found.png";

import { useActiveWeb3React } from "hooks";
import { WrongNetwork } from "./styles";

const requiredNetworkName = process.env.REACT_APP_NETWORK_NAME;

const NetworkModal = () => {
  const { active, chainId } = useActiveWeb3React();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      active &&
      chainId &&
      findNetworkNameByWeb3ChainId(chainId) !== requiredNetworkName
    )
      setShow(true);
    else setShow(false);
  }, [chainId, active]);

  return (
    <Modal isOpen={show} centered>
      <ModalBody>
        <WrongNetwork>
          <div className="text-center">
            <div className="pb-4">
              <img src={NotFoundPng} alt="error" width="300" className="mb-4" />
            </div>
            <h4 className="title pb-3">
              Your wallet is on a different network!
            </h4>
            <div className="subtitle">
              Select "{requiredNetworkName}" to continue.
            </div>
          </div>
        </WrongNetwork>
      </ModalBody>
    </Modal>
  );
};

export default NetworkModal;
