import styled from "styled-components/macro";

export default styled.div`
  padding: 3rem;

  .title {
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
  .subtitle {
    font-size: 1.4rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-top: 1rem;
  }

  .steps-container {
    display: flex;
    flex-direction: column;
    grid-gap: 2rem;
    align-items: center;
    justify-content: center;
    margin: 3rem 0;

    .step {
      padding: 2rem 3rem;
      border-radius: 0.4rem;
      border: solid 0.1rem #1452f5;
      width: 100%;
      // background-color: rgba(4, 52, 236, 0.1);
      background-color: #fff;
      display: flex;
      grid-gap: 2rem;

      .step-title {
        font-size: 1.4rem;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        margin-bottom: 1rem;
      }

      .step-subtitle {
        font-size: 1.6rem;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
      }
    }
  }
`;
