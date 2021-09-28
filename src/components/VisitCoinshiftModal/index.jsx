import { Modal, ModalBody } from "components/common/Modal/SimpleModal";
import ViewCoinshiftImg from "assets/images/view-coinshift.svg";
import CoinshiftBg from "assets/images/coinshift-bg.png";

import { CoinshiftContainer } from "./styles";
import Button from "components/common/Button";

const modalStyles = `
  .modal-content {
    border: none;
    background: #ffffff;
    margin: auto;
    max-width: 100rem;
  }
`;
const VisitCoinshiftModal = () => {
  return (
    <Modal isOpen={true} centered>
      <style>{modalStyles}</style>
      <ModalBody style={{ backgroundImage: `url(${CoinshiftBg})` }}>
        <CoinshiftContainer>
          <div className="img-container">
            <img src={ViewCoinshiftImg} alt="view coinshift" width="100%" />
          </div>
          <h2 className="main-title">Multisafe is now Coinshift</h2>
          <div className="main-subtitle">
            Smart Treasury Management for Crypto Organisations
          </div>

          <div className="buttons">
            <Button href={"https://app.coinshift.xyz"} width="18rem">
              Visit Coinshift
            </Button>
            <a
              href={
                "https://blog.coinshift.xyz/multisafe-is-now-coinshift-smart-treasury-management-for-crypto-organizations-da7dd7bfc648"
              }
              rel="noopenner noreferrer"
              target="_blank"
            >
              <Button className="secondary" width="18rem">
                View Announcement
              </Button>
            </a>
          </div>

          <div className="links">
            <a
              href={"https://blog.coinshift.xyz"}
              rel="noopenner noreferrer"
              target="_blank"
            >
              Blog
            </a>
            <span>|</span>
            <a
              href={"https://discord.com/invite/yHwg8DkBpf"}
              rel="noopenner noreferrer"
              target="_blank"
            >
              Discord
            </a>
            <span>|</span>
            <a
              href={"https://learn.coinshift.xyz"}
              rel="noopenner noreferrer"
              target="_blank"
            >
              Learn
            </a>
          </div>
        </CoinshiftContainer>
      </ModalBody>
    </Modal>
  );
};

export default VisitCoinshiftModal;
