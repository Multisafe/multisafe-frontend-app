import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  grid-area: assets;
  display: flex;
  flex-direction: column;
  min-height: 13rem;

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
      color: ${({ theme }) => theme.primary};
    }
  }

  .chart-container {
    margin: 3rem auto;
  }

  .assets-container {
    margin-top: 1rem;
    display: flex;
    gap: 1rem 3rem;
    flex-wrap: wrap;
    width: 100%;

    .asset-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;

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

  .no-assets {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
    margin-top: 1rem;

    .text {
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #989898;
    }

    .add-funds {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;

      .name {
        font-size: 1.4rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        -webkit-letter-spacing: normal;
        -moz-letter-spacing: normal;
        -ms-letter-spacing: normal;
        letter-spacing: normal;
        text-align: left;
        color: #1452f5;
        padding-top: 0.3rem;
      }
      &:hover {
        opacity: 0.7;
      }
    }
  }

  @media (max-width: 600px) {
    .assets-container {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
`;
