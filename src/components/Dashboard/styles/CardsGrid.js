import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
    "overview"
    "expenses"
    "recent-tx"
    "assets";

  @media (min-width: 978px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-gap: 3rem;
    grid-template-areas:
      "overview overview"
      "expenses recent-tx"
      "expenses assets";
  }
`;
