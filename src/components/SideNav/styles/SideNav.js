import styled from "styled-components/macro";

export default styled.div`
  width: 6em;
  position: fixed;
  // min-height: 92vh;
  height: 100%;
  z-index: 1;
  top: 80px;
  left: 0;
  overflow-x: hidden;
  transition: all 0s linear;
  padding-top: 60px;
  box-shadow: 3px 3px 8px 0 rgba(0, 0, 0, 0.16);
  background-color: ${({ theme }) => theme.primary};

  &.sticky {
    position: fixed;
  }
`;
