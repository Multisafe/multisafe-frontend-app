import styled from "styled-components/macro";

export default styled.input`
  font-size: 1.4rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  padding: 1rem 0;
  border: none;
  outline: none;
  border-bottom: 0.1rem solid #aaa;

  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #c7c7c7;
  }

  &::-moz-placeholder {
    /* Firefox 19+ */
    color: #c7c7c7;
  }

  &:-moz-placeholder {
    /* Firefox 18- */
    color: #c7c7c7;
  }
`;
