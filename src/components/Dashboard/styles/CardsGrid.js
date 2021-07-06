import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "overview overview"
    "expenses recent-tx";

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "overview"
      "expenses"
      "recent-tx";
  }
`;
