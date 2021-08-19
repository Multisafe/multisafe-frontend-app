import styled from "styled-components/macro";

export default styled.div`
  padding: 6rem 3rem;
  .process-text {
    font-size: 1.6rem;
    font-weight: normal;
    text-align: center;
    color: #373737;
    margin-top: 2rem;
  }

  .view-tx {
    color: ${({ theme }) => theme.primary} !important;
    margin: 1rem 0;
    text-align: center;
    font-size: 1.4rem;
  }

  .buttons {
    margin-top: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    grid-gap: 2rem;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;
