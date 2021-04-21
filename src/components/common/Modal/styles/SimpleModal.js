import styled from "styled-components/macro";
import { Modal } from "reactstrap";

export default styled(Modal)`
  position: relative;

  .modal-body {
    .title {
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .subtitle {
      font-size: 1.4rem;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      margin-top: 1rem;
      margin-bottom: 4rem;
    }
  }

  .close-btn {
    display: flex !important;
    justify-content: flex-end;
    align-items: center;
    img {
      cursor: pointer;
    }
  }
`;
