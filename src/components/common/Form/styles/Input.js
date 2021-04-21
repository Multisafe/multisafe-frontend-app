import styled from "styled-components/macro";

export default styled.input`
  width: 100%;
  min-height: 52px;
  border-radius: 8px;
  border: solid 0.5px #aaaaaa;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  padding: 0 12px;

  &:focus {
    outline: none;
    border: solid 0.5px #7367f0;
    background-color: #ffffff;
  }

  &[type="radio"] {
    width: auto;
  }

  &:invalid {
    border: solid 0.5px #aaaaaa;
    background-color: #ffffff;
  }
`;
