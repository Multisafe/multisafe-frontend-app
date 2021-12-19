import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  min-height: 10rem;
  width: 100%;
  margin-top: 3rem;

  .title {
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: bold;
    color: #373737;
  }

  .value {
    font-size: 1.6rem;
    color: #373737;
    margin-bottom: 2rem;
  }

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    grid-gap: 1rem 0;
  }
`;
