import styled from "styled-components/macro";

export default styled.div`
  min-height: 4rem;
  margin-right: 2rem;
  padding: 0 1.2rem;
  border-radius: 0.4rem;
  background-color: #7367f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  min-width: 10rem;

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

  .teams-dropdown {
    position: absolute;
    top: 5rem;
    width: 100%;
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
      z-index: 3;
    }

    .teams-option {
      padding: 1.5rem;
      border-bottom: 0.1rem solid #f1f0fd;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        margin-right: 1rem;
        width: 1.8rem;
      }

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
    margin-bottom: 1rem;
  }
`;
