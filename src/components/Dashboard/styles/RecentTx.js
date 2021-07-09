import styled from "styled-components/macro";
import { Card } from "components/common/Card";

export default styled(Card)`
  grid-area: recent-tx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 30rem;

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

  .tx-container {
    width: 100%;
    margin-top: 2rem;
    overflow-y: auto;

    .tx:last-child {
      border-bottom: none;
    }

    .tx {
      display: grid;
      grid-template-columns: 2.5fr 2fr 0fr;
      align-items: center;
      border-bottom: 0.1rem solid #dddcdc;
      padding: 1.6rem 0;

      .tx-info {
        display: flex;
        align-items: center;
      }

      .tx-status {
        font-size: 1.2rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #6cb44c;
      }

      .top {
        font-size: 1.4rem;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        margin-bottom: 1rem;
      }

      .bottom {
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

  .add-people-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .text {
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #8b8b8b;
    }
  }

  .view-people-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    width: 100%;
    // background: ${({ theme }) => theme.accent};
    border-bottom: 0.1rem solid #dddcdc;
    padding: 1.5rem;

    .name,
    .team {
      font-size: 1.4rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #373737;
    }
  }

  .view-people-container:last-child {
    border-bottom: none;
  }
`;
