import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  grid-area: expenses;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 44rem;

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

    .last-30 {
      font-size: 1.6rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #373737;
    }

    .view {
      color: ${({ theme }) => theme.primary};
    }
  }

  .money-in-out {
    display: flex;
    flex-wrap: wrap;
    margin-top: 3rem;
    justify-content: space-between;
    width: 100%;
    gap: 3rem;

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

  .divider {
    width: 100%;
    height: 1px;
    margin-top: 1rem;
    background-color: rgba(221, 220, 220, 0.5);
  }

  @media (max-width: 600px) {
    .money-in-out {
      flex-direction: column;
      justify-content: start;
      grid-gap: 1rem 0;
    }
  }
`;
