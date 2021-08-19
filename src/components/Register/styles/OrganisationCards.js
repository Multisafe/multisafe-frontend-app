import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1em;

  @media (max-width: 978px) {
    flex-wrap: wrap;
    justify-content: center;
    grid-gap: 2rem;
  }
`;
