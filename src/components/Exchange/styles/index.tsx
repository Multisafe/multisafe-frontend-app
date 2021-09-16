import styled from "styled-components";
import { Card } from "components/common/Card";

export const ExchangePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const ExhangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (min-width: 978px) {
    flex-direction: row;
  }
`;

export const ExchangeCard = styled(Card)`
  width: 100%;
  height: 28rem;

  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

export const ExchangeDetailsCard = styled(ExchangeCard)`
  justify-content: space-between;
`;

export const ExchangeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.4rem;
`;

export const ExchangeInputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const ExchangeCardTitle = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
`;

export const ExchangeDetailsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.4rem;
`;

export const ExchangeControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ExchangeControls = styled.div`
  display: flex;
  gap: 1rem;
`;

export const LoadingRateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;
