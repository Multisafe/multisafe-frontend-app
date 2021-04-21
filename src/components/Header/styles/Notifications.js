import styled from "styled-components/macro";

export default styled.div`
  width: 440px;
  height: 350px;
  overflow-y: auto;
  border-radius: 6px;
  box-shadow: 10px 10px 20px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px rgba(168, 168, 168, 0.2);
  background-color: #f6f6f6;
  position: absolute;
  top: 5em;
  right: 1em;
  z-index: 1;

  .notifications-title {
    padding: 20px;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #7367f0;
    border-bottom: solid 1px rgba(168, 168, 168, 0.2);
  }

  .no-notifications {
    margin-top: 5em;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #373737;
  }

  .notification {
    display: flex;
    padding: 15px;
    border-bottom: solid 1px rgba(168, 168, 168, 0.2);

    .dot {
      width: 2.5em;
    }

    .content {
      width: 85%;
    }

    .notification-heading {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .notification-description {
      font-size: 12px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .notification-date {
      margin-top: 10px;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .notification-view {
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #7367f0;
    }
  }
`;
