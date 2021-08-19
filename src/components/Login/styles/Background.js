import styled from "styled-components/macro";

export default styled.div`
  background: ${(props) => props.theme.background};
  display: flex;
  justify-content: center;
  max-width: 100rem;
  margin: 6rem auto;
`;
