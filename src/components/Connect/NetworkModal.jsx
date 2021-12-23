import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Modal, ModalBody } from "reactstrap";
import Button from "components/common/Button";

import { useActiveWeb3React } from "hooks";
import NotFoundImg from "assets/images/not-found.png";
import { WrongNetwork } from "./styles";
import { NETWORK_NAME_BY_ID } from "constants/networks";
import { ButtonContainer } from "components/Connect/styles/WrongNetwork";

const NetworkModal = () => {
  const { library, active, walletChainId, chainId } = useActiveWeb3React();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active && walletChainId && walletChainId !== chainId) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [walletChainId, chainId, active]);

  const switchNetwork = () => {
    library.send("wallet_switchEthereumChain", [
      { chainId: ethers.utils.hexValue(chainId) },
    ]);
  };

  return (
    <Modal isOpen={show} centered>
      <ModalBody>
        <WrongNetwork>
          <div className="text-center">
            <div className="pt-3 pb-4">
              <img src={NotFoundImg} alt="error" width="300" className="mb-4" />
            </div>
            <h4 className="title pb-3">
              Your wallet is on a different network!
            </h4>
            <ButtonContainer>
              <Button onClick={switchNetwork} className="secondary">
                Switch wallet to {NETWORK_NAME_BY_ID[chainId]}
              </Button>
            </ButtonContainer>
          </div>
        </WrongNetwork>
      </ModalBody>
    </Modal>
  );
};

export default NetworkModal;
