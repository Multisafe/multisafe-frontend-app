import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  padding: 1.6rem 3.2rem;
  color: #373737;
  h2 {
    font-weight: bold;
  }

  .connect,
  .login,
  .import {
    min-width: 40rem;
    padding: 1.4rem;
    border-radius: 0.8rem;
    box-shadow: 1rem 1rem 4rem 0 rgba(113, 113, 113, 0.25);
    font-size: 1.4rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-gap: 0 2rem;
  }

  .connect {
    background-color: ${({ theme }) => theme.primary};
    color: #ffffff;
  }

  .login,
  .import {
    margin-top: 2rem;
  }

  .import {
    color: ${({ theme }) => theme.primary};
    background-color: #fff;
  }

  .title {
    font-size: 1.6rem;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    margin-bottom: 2rem;
  }
  .subtitle {
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    margin-bottom: 2rem;
  }

  @media (max-width: 978px) {
    .buttons {
      flex-direction: column;
    }

    .connect,
    .login,
    .import {
      min-width: 20rem;
    }
  }
`;
