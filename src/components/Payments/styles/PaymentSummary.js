import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  .payment-info {
    width: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .payment-title {
      font-size: 1.2rem;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
      margin-bottom: 0.7rem;
    }
    .payment-subtitle {
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

  @media (max-width: 978px) {
    flex-direction: column;
    grid-gap: 2rem;
    align-items: flex-start;
    .payment-info {
      margin-top: 2rem;
      flex-direction: column;
      grid-gap: 2rem;
      align-items: flex-start;
    }
  }
`;
