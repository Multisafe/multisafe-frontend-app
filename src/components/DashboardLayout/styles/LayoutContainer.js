import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 20% 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 3fr;
  grid-template-areas:
    "sidebar nav nav nav"
    "sidebar main main main";

  @media (max-width: 978px) {
    grid-template-columns: 1fr;
    grid-template-rows: 0.2fr 2fr;
    grid-template-areas:
      "nav"
      "main";
  }
`;
