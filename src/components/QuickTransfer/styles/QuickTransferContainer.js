import styled from "styled-components/macro";

export default styled.div`
  padding: 4rem;

  .outer-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-bottom: 1.4rem;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .details-row {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .error-row {
    display: flex;
    align-items: center;
    div {
      width: 50%;
    }
    gap: 0 4rem;
  }

  .divider {
    width: 100%;
    height: 0.1rem;
    margin: 2rem 0;
    background-color: rgba(221, 220, 220, 0.5);
  }

  @media (max-width: 978px) {
    padding: 3rem 2rem;
    .outer-flex {
      flex-direction: column;
      gap: 2rem;
      align-items: flex-start;
    }

    .buttons {
      flex-wrap: wrap-reverse;
    }

    .details-row,
    .error-row {
      flex-wrap: wrap;
    }
  }
`;
