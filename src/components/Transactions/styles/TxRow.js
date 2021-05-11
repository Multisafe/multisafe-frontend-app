import styled from "styled-components/macro";

export default styled.tr`
  min-height: 8rem;
  position: relative;

  .direction {
    margin-right: 3rem;
  }

  .name,
  .amount,
  .usd {
    font-size: 1.4rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-bottom: 0.8rem;
  }

  .date {
    font-size: 1.2rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .usd {
    font-weight: normal;
  }

  .view {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #7367f0;
  }

  @media (max-width: 600px) {
    .direction {
      display: none;
    }
    .name,
    .amount,
    .usd,
    .date,
    .view,
    .status {
      font-size: 1.1rem;,
    }
  }
`;
