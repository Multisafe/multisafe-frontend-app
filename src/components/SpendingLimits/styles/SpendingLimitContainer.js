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
  }

  @media (max-width: 978px) {
    padding: 3rem 2rem;
    .outer-flex {
      flex-direction: column;
      grid-gap: 2rem;
      align-items: flex-start;
    }
  }
`;
