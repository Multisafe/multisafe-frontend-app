import styled from "styled-components/macro";

export default styled.main`
  grid-area: main;
  background-color: #f7f7f7;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem 5rem;

  @media (max-width: 978px) {
    padding: 1.75rem;
  }
`;
