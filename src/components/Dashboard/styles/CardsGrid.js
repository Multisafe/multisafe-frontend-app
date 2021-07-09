import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto auto;
  grid-template-areas:
    "overview overview"
    "expenses recent-tx"
    "expenses assets";

  @media (max-width: 978px) {
    grid-template-columns: 100%;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "overview"
      "expenses"
      "recent-tx"
      "assets";
  }
`;
