import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  height: ${(props) => props.height};
  background: ${({ theme, disabled }) =>
    disabled
      ? theme.card.inner.disabledBackgroundColor
      : theme.card.inner.backgroundColor};
  border: 1px solid ${({ theme }) => theme.card.inner.borderColor};
  transition: all 0.5s linear;
  border-radius: 16px;
  opacity: 1;
  padding: 16px 32px;
  color: ${({ disabled }) => (disabled ? "grey" : "#373737")};
  overflow-y: auto;
  h2 {
    font-weight: bold;
  }

  .connect,
  .login,
  .import {
    min-width: 400px;
    padding: 14px;
    border-radius: 8px;
    box-shadow: 10px 10px 40px 0 rgba(113, 113, 113, 0.25);
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
  }

  .connect {
    background-color: #7367f0;
    color: #ffffff;
  }

  .login,
  .import {
    width: 100%;
    margin-top: 20px;
  }

  .import {
    color: #7367f0;
    background-color: #fff;
  }

  .title {
    font-size: 16px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    margin-bottom: 20px;
  }
  .subtitle {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    margin-bottom: 20px;
  }
`;
