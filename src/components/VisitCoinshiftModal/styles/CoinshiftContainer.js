import styled from "styled-components/macro";

export default styled.div`
  text-align: center;
  padding: 4rem 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .img-container {
    max-width: 36rem;
  }

  .main-title {
    font-size: 5rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #373737;
    margin-top: 2rem;
  }

  .main-subtitle {
    font-size: 2rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    color: ${({ theme }) => theme.primary};
    padding: 1rem 0;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4rem;
    margin-top: 4rem;
    align-items: center;
    justify-content: center;
  }

  .links {
    disply: flex;
    font-size: 1.8rem;
    text-align: center;
    margin-top: 3rem;
    a {
      color: #373737;
      padding: 0 1rem;
    }
  }

  @media (max-width: 60rem) {
    .img-container {
      max-width: 30rem;
    }

    .main-title {
      font-size: 2.4rem;
    }
    .main-subtitle {
      font-size: 1.6rem;
    }

    .buttons {
      margin-top: 2rem;
      gap: 2rem;
    }

    .links {
      font-size: 1.6rem;
    }
  }
`;
