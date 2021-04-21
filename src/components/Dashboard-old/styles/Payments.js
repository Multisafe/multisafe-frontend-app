import styled from "styled-components/macro";

export default styled.div`
  margin: 16px 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .payment-date {
    width: 56px;
    height: 56px;
    padding: 11px 14px 10px;
    opacity: 1;
    border: solid 0.5px ${({ theme }) => theme.primary};
    border-radius: 10px;
    background-color: rgba(229, 229, 229, 0.4);
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: center;
    color: #8b8b8b;

    span {
      display: block;
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.19;
      letter-spacing: normal;
      text-align: center;
      color: #8b8b8b;
    }
  }

  .payment-details {
    width: 100%;
    min-width: 200px;
    max-height: 56px;
    margin-left: 16px;
    padding: 11px 0 10px 20px;
    border-radius: 8px;
    border: solid 1px #f2f2f2;

    .title {
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #8b8b8b;
    }

    .amount {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.19;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }
`;
