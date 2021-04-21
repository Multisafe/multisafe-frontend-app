import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  max-width: 1200px;
  // min-height: 90vh;
  margin: 0 auto;
  grid-template-columns: 1fr;
  position: absolute;
  left: 0;
  right: 0;
  top: 180px;
  .new-user {
    grid-row: 1/5;
  }

  .details-card {
    margin: 0 auto;
    width: 683px;
    min-height: 351px;
    padding: 17px 36px 27px 30px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: 200px;
    left: 0;
    right: 0;

    .details-title {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }

  .payment-status-card {
    margin: 0 auto;
    // max-width: 1000px;
    width: fit-content;
    min-width: 683px;
    min-height: 160px;
    padding: 17px 36px 27px 30px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: -70px;
    left: 0;
    right: 0;

    .payment-status-title {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .payment-status-threshold {
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;

      span {
        font-weight: bold;
      }
    }

    .status-card {
      .success {
        background-color: #3bd800;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        text-transform: uppercase;
        color: #fff;
      }

      .rejected,
      .failed {
        background-color: #ff0a0a;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        text-transform: uppercase;
        color: #fff;
      }

      .pending {
        background-color: #fdbe42;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        text-transform: uppercase;
        color: #fff;
      }
    }

    .confirm-steps-container {
      min-height: 100px;
      width: fit-content;
      margin: 20px auto 0;
      padding: 0 20px;
    }
  }

  .multisig-details-card {
    margin: 0 auto;
    width: 683px;
    min-height: 200px;
    padding: 17px 36px 27px 30px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: 450px;
    left: 0;
    right: 0;

    .details-title {
      font-size: 20px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px 10px;
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
`;
