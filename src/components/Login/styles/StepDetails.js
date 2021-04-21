import styled from "styled-components/macro";

export default styled.div`
  padding: 10px 36px 100px;

  .title {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-top: 20px;
  }

  .subtitle {
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    color: #373737;
    padding: 10px 0;
  }

  .radio-toolbar input[type="radio"] {
    display: none;
  }

  .radio-toolbar label {
    display: inline-block;
    padding: 4px 11px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
    margin-right: 10px;
    min-width: 133px;
    border-radius: 8px;
    border: solid 0.5px #aaaaaa;
    background-color: #f2f2f2;
  }

  .radio-toolbar input[type="radio"]:checked + label {
    background-color: #c3c3c3;
  }

  .default-address {
    pointer-events: none;
    opacity: 0.7;
  }

  .proceed-btn {
    width: 400px;
    padding: 14px;
    border-radius: 8px;
    box-shadow: 10px 10px 40px 0 rgba(113, 113, 113, 0.25);
    background-color: #7367f0;
    position: absolute;
    right: 40px;
    bottom: 40px;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;

    &:hover {
      background-color: #3c3c3c;
    }
  }
`;
