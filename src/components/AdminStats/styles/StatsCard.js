import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

  .title {
    font-size: 1.6rem;
    font-weight: normal;
    text-align: left;
    color: #373737;

    span {
      font-size: 1.4rem;
      font-weight: 900;
      text-align: left;
      color: #373737;
    }
  }

  .flex {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 4rem;
  }

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    grid-gap: 1rem 0;
  }
`;
