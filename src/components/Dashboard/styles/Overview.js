import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  grid-area: overview;
  padding: 0;
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  .left {
    padding: 2.2rem 3rem 1rem;
    .total-balance {
      font-size: 1.4rem;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .amount {
      margin-top: 1rem;

      .symbol,
      .value,
      .decimals {
        font-size: 4rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .symbol {
        color: #aaaaaa;
      }

      .value {
        color: #373737;
      }

      .decimals {
        font-size: 2rem;
      }
    }
  }

  .graph {
    width: 100%;
  }
`;
