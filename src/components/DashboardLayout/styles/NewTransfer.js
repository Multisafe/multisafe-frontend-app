import styled from "styled-components/macro";

export default styled.div`
  min-height: 4rem;
  margin-right: 3rem;
  padding: 1.2rem;
  border-radius: 0.4rem;
  box-shadow: 1rem 1rem 2rem 0 rgba(77, 69, 164, 0.1);
  background-color: #7367f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  .text {
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  .transfer-dropdown {
    position: absolute;
    top: 5rem;
    left: -4rem;
    min-width: 20rem;
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

    .transfer-option {
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
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #7367f0;
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
`;
