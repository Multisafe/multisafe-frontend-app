import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  grid-area: overview;
  display: grid;
  grid-template-columns: 1fr 1fr;
  .left {
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
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .money-out {
      margin-left: 3rem;
    }

    .heading {
      font-size: 1.4rem;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .value-container {
      width: 20rem;
      height: 4rem;
      margin-top: 1rem;
      padding: 1rem 2rem;
      border-radius: 0.2rem;
      border: solid 0.1rem #f7f7f8;
      background-color: #f7f7f7;
      font-size: 1.6rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;

      .plus {
        color: #6cb44c;
      }

      .minus {
        color: #ff4b55;
      }

      &.grey {
        color: #aaaaaa;
      }
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-gap: 1rem 0;
    justify-items: flex-start;
    .right {
      flex-direction: column;
      justify-content: start;
      grid-gap: 1rem 0;

      .money-out {
        margin-left: 0;
      }
    }
  }
`;
