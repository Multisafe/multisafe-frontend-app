import styled from "styled-components/macro";

export default styled.button`
  width: ${({ width }) => width};
  min-height: 4rem;
  padding: 1.2rem 2rem;
  background-color: #7367f0;

  font-size: 1.4rem;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  border: none;
  border-radius: 0.4rem;

  ${(props) =>
    props.large &&
    `
    width: 100%;
    min-height: 6rem;
    border-radius: 1rem;
  `}

  &:hover {
    background-color: #3c3c3c;
  }

  &:focus {
    outline: 0;
  }

  &.secondary {
    background: white;
    border: 0.1rem solid ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    &:hover {
      background-color: ${({ theme }) => theme.primary};
      color: white;
    }
  }

  &.secondary-2 {
    background: #dddcdc;
    color: #8b8b8b;
    &:hover {
      opacity: 0.85;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
