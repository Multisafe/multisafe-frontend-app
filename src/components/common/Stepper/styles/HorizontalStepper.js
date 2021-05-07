import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  grid-template-columns: repeat(${({ count }) => count}, 1fr);
  width: ${({ count }) => count * 15}rem;

  .step {
    .step-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .step-circles {
      position: relative;
    }

    .step-circle {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }

    .outer-step-circle {
      position: absolute;
      width: 1.4rem;
      height: 1.4rem;
      top: -0.3rem;
      left: -0.3rem;
      padding: 0.8rem;
      right: 0;
      border-radius: 50%;
      opacity: 0.5;
    }

    .step-info-text {
      text-align: center;
      margin-top: 1.5rem;
    }

    .step-title {
      font-size: 1.4rem;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #373737;
      font-weight: 500;
    }

    .step-subtitle {
      margin-top: 0.5rem;
      font-size: 1.2rem;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #373737;
      font-weight: normal;
    }

    .step-text {
      margin-top: 0.5rem;
      font-size: 1.2rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #7367f0;
    }

    .step-bar-left {
      width: 100%;
      height: 0.1rem;
      background-color: #dddcdc;
    }
    .step-bar-right {
      width: 100%;
      height: 0.1rem;
      background-color: #dddcdc;
    }

    &:first-child {
      .step-bar-left {
        opacity: 0;
        visibility: hidden;
      }
    }
    &:last-child {
      .step-bar-right {
        opacity: 0;
        visibility: hidden;
      }
    }
  }
`;
