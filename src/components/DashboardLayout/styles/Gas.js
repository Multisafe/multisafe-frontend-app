import styled from "styled-components/macro";

export default styled.div`
  min-height: 4rem;
  min-width: 11rem;
  padding: 1rem;
  background-color: #ffffff;
  margin-right: 3rem;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  .text {
    font-size: 1.2rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    text-align: left;
    color: #373737;
    padding-top: 0.3rem;
  }

  .gas-dropdown {
    position: absolute;
    top: 5rem;
    right: 0;
    min-width: 32rem;
    border-radius: 1rem;
    box-shadow: 1rem 1rem 2rem 0 rgba(170, 170, 170, 0.2);
    border: solid 0.1rem #dddcdc;
    background-color: #ffffff;
    transition: opacity 0.15s linear;
    opacity: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;

    &.show {
      visibility: visible;
      opacity: 1;
      height: auto;
      z-index: 30;
      cursor: initial;
    }

    .gas-title {
      font-size: 1.4rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      padding: 1.5rem 1.5rem 1rem;
    }

    .gas-options {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 0 1.5rem 1.8rem;
      grid-gap: 1rem;
    }

    .gas-option {
      padding: 1.5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;

      width: 9rem;
      max-height: 6rem;
      border-radius: 0.4rem;
      border: solid 0.1rem #dddcdc;
      background-color: #ffffff;

      &.active {
        border: solid 0.1rem ${({ theme }) => theme.primary};
      }

      .name {
        font-size: 1.2rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        margin-bottom: 0.4rem;
      }

      .value {
        font-size: 1.2rem;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      &:hover {
        opacity: 0.8;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }
  @media (max-width: 600px) {
    margin-right: 2rem;
  }
`;
