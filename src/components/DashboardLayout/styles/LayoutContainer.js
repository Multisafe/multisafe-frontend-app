import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  height: calc(100vh - 6rem);
  width: 100vw;
  grid-template-columns: 28rem auto;
  grid-template-rows: 9rem auto;
  grid-template-areas:
    "sidebar nav"
    "sidebar main";

  @media (max-width: 978px) {
    height: calc(100vh - 10rem);
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "nav"
      "main";
  }
`;
