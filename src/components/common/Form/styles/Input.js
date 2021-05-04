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
  &[type="radio"]:checked,
  &[type="radio"]:not(:checked) {
    position: absolute;
    left: -9999rem;
  }
  &[type="radio"]:checked + label,
  &[type="radio"]:not(:checked) + label {
    position: relative;
    padding-left: 2.8rem;
    cursor: pointer;
    display: inline-block;
    color: #373737;
  }
  &[type="radio"]:checked + label:before,
  &[type="radio"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 1.8rem;
    height: 1.8rem;
    border: 0.1rem solid #ddd;
    border-radius: 100%;
    background: #fff;
  }
  &[type="radio"]:checked + label:after,
  &[type="radio"]:not(:checked) + label:after {
    content: "";
    width: 1.2rem;
    height: 1.2rem;
    background: #7367f0;
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    border-radius: 100%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
  &[type="radio"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  &[type="radio"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
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
