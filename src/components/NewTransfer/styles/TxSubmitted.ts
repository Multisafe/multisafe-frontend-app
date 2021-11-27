import styled from "styled-components/macro";

export const TxSubmittedContainer = styled.div`
  padding: 6rem 3rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const ProcessedText = styled.div`
  font-size: 1.6rem;
  font-weight: normal;
  text-align: center;
  color: #373737;
  margin-top: 2rem;
`;

export const ViewTx = styled.div`
  color: ${({ theme }) => theme.primary} !important;
  margin: 1rem 0;
  text-align: center;
  font-size: 1.4rem;
`;

export const ButtonsContainer = styled.div`
  margin-top: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 2rem;
`;
