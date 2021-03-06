import styled from "styled-components/macro";
import { slide as Menu } from "react-burger-menu";

export default styled(Menu)`
  .notifications-header {
    width: 100%;
    height: 6rem;
    padding: 0 3rem;
    background-color: ${({ theme }) => theme.accent};
    display: flex;
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

  .notification {
    padding: 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 0.1em solid ${({ theme }) => theme.accent};

    .dot {
      margin-right: 1rem;
    }

    &:focus {
      outline: none;
    }

    .content {
      .notification-heading {
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

      .notification-description,
      .notification-date {
        font-size: 1.2rem;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .notification-description {
        margin-bottom: 0.5rem;
      }
    }
    .notification-view {
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      text-align: left;
      color: ${({ theme }) => theme.primary};
    }
  }

  .no-notifications {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 90vh;

    .text {
      font-size: 1.6rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #989898;
      margin-top: 3rem;
    }
  }
`;
