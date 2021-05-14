import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 72px;
  margin: 20px 0;
  padding: 16px;
  border-radius: 8px;
  border: solid 1px #f2f2f2;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .token-balance {
    width: 70%;
    margin-left: 18px;

    .value {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.19;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .name {
      font-size: 14px;
      font-weight: 300;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }

  .change {
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: right;
    color: ${({ theme }) => theme.primary};
    text-transform: uppercase;
  }
`;
