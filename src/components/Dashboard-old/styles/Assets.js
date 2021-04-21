import styled from "styled-components/macro";

export default styled.div`
  margin: 16px 0;
  padding: 0 0 0 16px;
  border-radius: 8px;
  border: solid 1px #f2f2f2;
  background-color: #ffffff;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .token-balance {
    margin: 18px 201px 4px 16px;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .token-name {
    margin: 4px 157px 17px 16px;
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .token-usd {
    min-width: 184px;
    padding: 19px 7px 20px 33px;
    background-color: #f2f2f2;

    .token-usd-title {
      font-size: 14px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: center;
      color: #373737;
      text-transform: uppercase;
    }

    .token-usd-amount {
      margin-top: 5px;
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
`;
