import styled from "styled-components/macro";

export default styled.div`
  background-color: #fff;
  border-radius: 0.4rem;
  border: solid 0.1rem #dddcdc;
  padding: 2rem 3rem;
  margin-top: 3rem;

  .title {
    font-size: 1.6rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    width: 100%;
  }

  .detail-cards {
    display: flex;
    flex-wrap: wrap;
    grid-gap: 2rem;
    margin-top: 2rem;

    .detail-card {
      padding: 1.2rem 1.5rem;
      border-radius: 0.2rem;
      border: solid 0.1rem #f7f7f8;
      background-color: #f7f7f7;
      min-width: 22rem;

      .detail-title {
        font-size: 1.2rem;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #888888;
        margin-bottom: 0.5rem;
      }
      .detail-subtitle {
        font-size: 1.4rem;
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

  .icons {
    display: flex;
    position: relative;
  }

  @media (max-width: 600px) {
    .detail-cards {
      .detail-card {
        min-width: 100%;
      }
    }
  }
`;
