import styled from "styled-components/macro";

export default styled.div`
  display: contents;
  cursor: pointer;
  position: relative;
  max-width: 10rem;

  .text {
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    padding-top: 0.1rem;
  }

  .modify-team-dropdown {
    position: absolute;
    top: 10rem;
    right: 4rem;
    width: 10rem;
    border-radius: 0.2rem;
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
      z-index: 3;
    }

    .modify-team-option {
      padding: 1rem;
      border-bottom: 0.1rem solid #f1f0fd;
      display: flex;
      align-items: center;
      justify-content: center;

      .name {
        font-size: 1.4rem;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #373737;
        padding-top: 0.3rem;
      }

      &:hover {
        opacity: 0.85;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }

  @media (max-width: 978px) {
    .modify-team-dropdown {
      right: 1rem;
    }
  }
`;
