import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 82px;
  border-radius: 8px;
  border: solid 0.5px #aaaaaa;
  background-color: #f2f2f2;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  padding: 0 12px;
  input {
    border: none;
    width: 100%;
    min-height: 52px;
    background-color: #f2f2f2;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    &:focus {
      outline: none;
    }

    &[type="radio"] {
      width: auto;
    }
  }

  .convert {
    transform: rotateZ(90deg);
  }

  .usdAmount,
  .tokenAmount {
    display: flex;
    align-items: baseline;

    span {
      font-size: 16px;
      color: #8b8b8b;
      margin-right: 4px;
    }
  }

  .tokenAmount {
    width: 100%;
  }
`;
