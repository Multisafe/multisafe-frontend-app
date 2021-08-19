import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  min-height: 10rem;
  overflow-x: auto;

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    grid-gap: 1rem 0;
  }
`;
