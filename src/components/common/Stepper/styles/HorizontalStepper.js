import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .step {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 100px;

    .step-info {
      position: relative;
    }
    .step-circle {
      position: relative;
      width: 36px;
      height: 36px;
      padding: 8px;
      // background-color: #7367f0;
      border-radius: 50%;
      border: 8px solid #f2f2f2;

      span {
        position: absolute;
        left: 0;
        right: 0;
        font-size: 20px;
        top: -5px;
      }
    }

    .step-info-text {
      position: absolute;
      top: 2.5em;
      left: -2em;
      min-width: 100px;
    }

    .step-title {
      margin-top: 0.5em;
      font-size: 14px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: center;
      color: #373737;
      font-weight: bold;
    }

    .step-subtitle {
      margin-top: 0.5em;
      font-size: 14px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      text-align: center;
      color: #373737;
      font-weight: normal;
    }

    .step-bar-right {
      min-width: ${({ count }) => (count < 5 ? "200px" : "100px")};
      width: 100%;
      height: 10px;
      background-color: #f2f2f2;
    }
  }
`;
