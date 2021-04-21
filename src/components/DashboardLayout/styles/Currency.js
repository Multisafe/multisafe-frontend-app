import styled from "styled-components/macro";

export default styled.div`
  min-height: 4em;
  min-width: 11em;
  padding: 1em;
  background-color: #ffffff;
  margin-right: 3em;
  border-radius: 0.4em;
  box-shadow: 1em 1em 2em 0 rgba(77, 69, 164, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  .text {
    font-size: 1.2em;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    text-align: left;
    color: #373737;
    padding-top: 0.3em;
  }

  .currency-dropdown {
    position: absolute;
    top: 5em;
    left: -4em;
    min-width: 20em;
    border-radius: 1em;
    box-shadow: 1em 1em 2em 0 rgba(170, 170, 170, 0.2);
    border: solid 0.1em #dddcdc;
    background-color: #ffffff;
    transition: opacity 0.15s linear;
    opacity: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;

    &.show {
      visibility: visible;
      opacity: 1;
      height: auto;
      z-index: 30;
    }

    .currency-option {
      padding: 1.5em;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        margin-right: 0.8em;
        font-size: 1.6em;
      }

      .name {
        font-size: 1.2em;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        padding-top: 0.3em;
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
