import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  height: 80px;
  margin: 16px;
  padding: 16px 28px 16px 16px;
  border-radius: 8px;
  border: solid 1px #f2f2f2;
  background-color: #ffffff;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .token-icon {
    width: 40px;
  }

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

  .divider {
    width: 0;
    height: 48px;
    opacity: 0.16;
    border: solid 1px #707070;
  }

  .text {
    font-size: 14px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .radio {
    width: 24px;
    height: 24px;
    border: solid 6px #f2f2f2;
    border-radius: 50%;
    background-color: ${({ theme, active }) =>
      active ? theme.primary : "#ffffff"};
  }

  ${({ active }) =>
    active
      ? `
    .current {
        width: 82px;
        height: 24px;
        border-radius: 8px;
        border: solid 1px #f2f2f2;
        background-color: #1452f5;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: -12px;
        right: 10px;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.25;
        letter-spacing: normal;
        text-align: right;
        color: #ffffff;
        text-transform: uppercase;
    }
  `
      : `
  .current {
    display: none;
  }`}
`;
