import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 28rem auto;
  grid-template-rows: 9rem auto;
  grid-template-areas:
    "sidebar nav"
    "sidebar main";

  @media (max-width: 978px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "nav"
      "main";
  }
`;
