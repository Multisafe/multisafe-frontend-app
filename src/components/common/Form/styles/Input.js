import styled from "styled-components/macro";

export default styled.input`
  width: 100%;
  min-height: 4rem;
  border-radius: 0.2rem;
  border: solid 0.1rem #dddcdc;
  background-color: #ffffff;
  font-size: 1.4rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  padding: 0 1.2rem;

  &:focus {
    outline: none;
    border: solid 0.1rem #7367f0;
    background-color: #ffffff;
  }

  &[type="radio"] {
    width: auto;
  }

  &:invalid {
    border: solid 0.1rem #aaaaaa;
    background-color: #ffffff;
  }

  &::-webkit-input-placeholder {
    color: #8b8b8b;
  }

  &::-moz-placeholder {
    color: #8b8b8b;
  }

  &:-moz-placeholder {
    color: #8b8b8b;
  }
`;
