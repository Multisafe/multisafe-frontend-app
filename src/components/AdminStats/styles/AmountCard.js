import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  min-height: 10rem;
  width: 100%;

  .title {
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: normal;
    text-align: center;
    color: #373737;
  }

  .amount {
    font-size: 3rem;
    font-weight: 900;
    text-align: center;
    color: #373737;
  }

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    grid-gap: 1rem 0;
  }
`;
