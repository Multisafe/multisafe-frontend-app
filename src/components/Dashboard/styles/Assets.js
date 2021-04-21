import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  grid-area: assets;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .title,
    .view {
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .view {
      color: #7367f0;
    }
  }

  .chart-container {
    margin: 3rem auto;
  }

  .assets-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1.5rem;
    width: 100%;

    .asset-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      border-radius: 0.4rem;
      background-color: #f1f0fd;

      .token-details {
        display: flex;
        align-items: center;
      }

      .token-icon {
        width: 2rem;
        margin-right: 1rem;
      }

      .token-name,
      .usd {
        font-size: 1.4rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .token-name {
        margin-bottom: 0.5rem;
      }

      .token-amount {
        font-size: 1.2rem;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }
    }
  }

  @media (max-width: 600px) {
    .assets-container {
      grid-template-columns: 1fr;
    }
  }
`;
