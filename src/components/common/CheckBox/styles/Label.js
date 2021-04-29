import styled from "styled-components/macro";

export default styled.label`
  display: block;
  position: relative;
  padding-left: 1rem;
  cursor: pointer;
  margin-bottom: 0;

  input[type="checkbox"] {
    visibility: hidden;
  }

  span {
    padding-left: 1rem;
  }

  .custom-checkbox {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    height: 1.4rem;
    width: 1.4rem;
    background-color: #fff;
    border: 0.1rem solid #dddcdc;
  }

  &:hover input ~ .custom-checkbox {
    background-color: #fff;
  }

  input:active ~ .custom-checkbox {
    background-color: #fff;
  }

  input:checked ~ .custom-checkbox {
    background-color: #0000ff;
    border: 0.1rem solid #0000ff;
  }

  .custom-checkbox:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ .custom-checkbox:after {
    display: block;
  }

  .custom-checkbox:after {
    left: 0.4rem;
    top: 0.1rem;
    bottom: 5px;
    width: 0.4rem;
    height: 0.8rem;
    border: solid white;
    border-width: 0 0.15rem 0.15rem 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;
