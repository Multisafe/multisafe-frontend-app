import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  position: absolute;
  left: 0;
  right: 0;
  top: 240px;
  .new-user {
    grid-row: 1/5;
  }

  .department-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0 20px;
    margin: 40px;

    .department-card {
      cursor: pointer;
      width: 100%;
      min-height: 160px;
      box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      border: solid 1px #f2f2f2;
      background-color: #ffffff;

      &:hover {
        opacity: 0.7;
      }

      .upper {
        padding: 16px;
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.19;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .lower {
        padding: 16px;
        font-size: 14px;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }

      .line {
        width: 100%;
        height: 0;
        border: solid 1px #f2f2f2;
      }
    }
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
    margin: 16px auto;

    &.circle-grey {
      width: 44px;
      height: 44px;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }
  }

  .payment-success {
    width: 488px;
    max-height: 656px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    padding: 30px 36px;
  }
`;
