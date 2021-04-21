import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  grid-template-rows: repeat(4, minmax(100px, auto));
  position: absolute;
  left: 0;
  right: 0;
  top: 180px;
  .account {
    grid-row: 1/5;
  }

  .status {
  }

  .payments {
    grid-row: 2/5;
  }

  .card-title {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .card-subtitle {
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }

  .circle {
    width: 48px;
    height: 48px;
    padding: 12px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .overview-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin-top: 20px;
    .overview-card {
      // max-width: 353px;
      width: 100%;
      height: 120px;
      padding: 25px 15px;
      border-radius: 8px;
      border: solid 1px #f2f2f2;

      .overview-text {
        font-size: 12px;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.25;
        letter-spacing: normal;
        text-align: center;
        color: #373737;
        text-transform: uppercase;
      }

      .overview-amount {
        font-size: 36px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.22;
        letter-spacing: normal;
        text-align: center;
        color: #8b8b8b;
        margin-top: 8px;
      }
      .overview-coming-soon {
        font-size: 18px;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.22;
        letter-spacing: normal;
        text-align: center;
        color: #8b8b8b;
        margin-top: 20px;
      }
    }
  }

  .see-token {
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;

    .account {
      grid-row: 1 / auto;
    }

    .payments {
      grid-row: 2 / auto;
    }
  }
`;
