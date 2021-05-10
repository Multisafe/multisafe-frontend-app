import styled from "styled-components/macro";

export default styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;
