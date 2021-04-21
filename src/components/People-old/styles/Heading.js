import styled from "styled-components/macro";

export default styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #373737;

  &.grey {
    margin-bottom: 0;
    margin-top: 0.4em;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
  }

  &.choosen-dept {
    font-size: 14px;
    margin-left: 10px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  &.payment-status-threshold {
    font-size: 16px;
    margin-top: 8px;
    span {
      font-weight: bold;
    }
  }
`;
