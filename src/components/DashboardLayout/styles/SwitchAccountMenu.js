import styled from "styled-components/macro";
import { slide as Menu } from "react-burger-menu";

export default styled(Menu)`
  position: relative;
  .switch-account-header {
    width: 100%;
    height: 6rem;
    padding: 0 3rem;
    background-color: ${({ theme }) => theme.accent};
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

  .safes {
    &:focus {
      outline: none;
    }
    cursor: pointer;
    width: 100%;

    .safe-option {
      border-bottom: 0.1rem solid #dddcdc;
      padding: 2rem 3rem;

      .name {
        font-size: 1.4rem;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        margin-bottom: 0.6rem;
        word-break: break-all;
      }

      .address {
        font-size: 1.2rem;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        word-break: break-all;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .no-safes {
    padding: 3rem;
    font-size: 1.4rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-bottom: 0.6rem;
  }

  .search-safes {
    display: flex !important;
    border-bottom: 0.1rem solid #dddcdc;
    padding: 1rem 3rem 0;
    gap: 1.4rem;

    .safe-input {
      border-bottom: 0;
    }
  }
`;
