import styled from "styled-components/macro";
import { Modal } from "reactstrap";

export default styled(Modal)`
  .header-flex {
    font-size: 2.2rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close-btn {
      cursor: pointer;
    }
  }

  @media (max-width: 978px) {
    .modal-card {
      width: 100% !important;
    }
  }
`;
