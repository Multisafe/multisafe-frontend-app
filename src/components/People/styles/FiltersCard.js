import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10rem;

  .title {
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .subtitle {
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  @media (max-width: 978px) {
    height: auto;
    flex-wrap: wrap;
    .flex {
      flex-wrap: wrap;
    }
  }
`;
