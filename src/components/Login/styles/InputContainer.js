import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: ${({ dividerBottom }) =>
    dividerBottom ? "solid 0.05rem #aaaaaa" : "none"};
  border-right: ${({ dividerRight }) =>
    dividerRight ? "solid 0.05rem #aaaaaa" : "none"};
  padding: 1.5rem 3.4rem;

  label {
    font-size: 1.6rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
  }

  input {
    border: none;
    font-weight: normal;

    &::placeholder {
      color: #888;
    }
    &:focus {
      outline: none;
    }
  }
`;
