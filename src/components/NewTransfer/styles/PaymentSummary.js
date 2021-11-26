import styled from "styled-components/macro";

export const PaymentSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  @media (max-width: 978px) {
    flex-direction: column;
    grid-gap: 2rem;
    align-items: flex-start;
  }
`;

export const PaymentInfo = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 978px) {
    margin-top: 2rem;
    flex-direction: column;
    grid-gap: 2rem;
    align-items: flex-start;
  }
`;

export const PaymentTitle = styled.div`
  font-size: 1.2rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  margin-bottom: 0.7rem;
`;

export const PaymentSubtitle = styled.div`
  font-size: 1.4rem;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  margin-bottom: 0.4rem;
`;

export const PaymentFlex = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem 3rem;
`;

export const PaymentButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem 0;
  margin: 3rem 0 2rem;
`;
