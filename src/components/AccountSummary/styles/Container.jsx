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

  .balance-card,
  .interest-card {
    height: 105px;
    margin: 0 auto;
    // max-width: 1000px;
    width: 100%;
    // min-width: 683px;
    min-height: 0px;
    padding: 17px 36px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .balance-title,
    .interest-title {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #8b8b8b;
    }

    .balance-subtitle {
      font-size: 32px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      margin-top: 10px;

      span {
        font-weight: bold;
      }
    }
    .interest-subtitle {
      font-size: 18px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: left;
      color: #8b8b8b;
      margin-top: 16px;

      span {
        font-weight: bold;
      }
    }
  }

  .add-custom-card {
    margin: 0 auto;
    width: 683px;
    min-height: 0px;
    padding: 17px 36px;
    border-radius: 16px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f2f2f2;
    background-color: #ffffff;
    position: absolute;
    top: 480px;
    left: 0;
    right: 0;
  }

  .cards {
    position: absolute;
    top: -70px;
    left: 0;
    right: 0;
    max-width: 683px;
    margin: auto;
  }
`;
