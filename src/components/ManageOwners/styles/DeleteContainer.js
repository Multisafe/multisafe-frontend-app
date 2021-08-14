import styled from "styled-components/macro";

export default styled.div`
  padding: 4rem;

  .title {
    font-size: 1.6rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-bottom: 2rem;
    word-break: break-word;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 5rem;
  }

  .threshold-select {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 978px) {
    padding: 3rem 2rem;
    .buttons {
      margin-top: 4rem;
      flex-wrap: wrap-reverse;
    }
  }
`;
