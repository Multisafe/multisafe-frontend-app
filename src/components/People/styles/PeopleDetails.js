import styled from "styled-components/macro";
import { slide as Menu } from "react-burger-menu";

export default styled(Menu)`
  position: relative;
  .people-details-header {
    width: 100%;
    height: 6rem;
    padding: 0 3rem;
    background-color: #e3e1fc;
    display: flex !important;
    justify-content: space-between;
    align-items: center;

    &:focus {
      outline: none;
    }

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

    .close {
      cursor: pointer;
    }
  }

  .details {
    &:focus {
      outline: none;
    }
    margin-top: 5rem;
    width: 100%;
    padding: 0 3rem;

    .detail {
      margin-bottom: 4rem;

      .title {
        margin-bottom: 1rem;
        font-size: 1.4rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .subtitle {
        display: flex;
        align-items: center;
        font-size: 1.4rem;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .icons {
        margin-top: 1rem;
        display: flex;
        align-items: center;
      }
    }
  }

  .modify-buttons {
    display: flex !important;
    justify-content: center;
    align-items: center;
    margin-top: 30rem;
  }
`;
