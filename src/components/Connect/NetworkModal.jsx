import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Modal, ModalBody } from "reactstrap";
import Button from "components/common/Button";

import { useActiveWeb3React } from "hooks";
import NotFoundImg from "assets/images/not-found.png";
import { WrongNetwork } from "./styles";
import {CHAIN_IDS, NETWORK_NAME_BY_ID, NETWORK_NAMES} from "constants/networks";
import { ButtonContainer } from "components/Connect/styles/WrongNetwork";

const NETWORK_DETAILS_BY_ID = {
  [CHAIN_IDS[NETWORK_NAMES.POLYGON]]: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  }
}

const NetworkModal = () => {
  const { onboard, library, active, walletChainId, chainId } = useActiveWeb3React();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active && walletChainId && walletChainId !== chainId) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [walletChainId, chainId, active]);

  const switchNetwork = async () => {
    try {
      await library.send("wallet_switchEthereumChain", [
        { chainId: ethers.utils.hexValue(chainId) },
      ]);
    } catch (e) {
      if (e.code === 4902) { //Unrecognized chain ID
        addNetwork();
      }
    }
  };

  const addNetwork = async () => {
    try {
      await library.send("wallet_addEthereumChain", [NETWORK_DETAILS_BY_ID[chainId]]);
    } catch (e) {
      onboard.walletCheck();
    }
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
