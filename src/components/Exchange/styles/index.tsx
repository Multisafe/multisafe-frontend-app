import styled from "styled-components";
import { Card } from "components/common/Card";
import { Input } from "components/common/Form";
import Img from "components/common/Img";

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
  height: 42rem;

  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const ExchangeDetailsCard = styled(ExchangeCard)`
  justify-content: space-between;
`;

export const ExchangeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ExchangeInputGroup = styled.div`
  border: 1px solid #dddcdc;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ExchangeInput = styled(Input)`
  border: none;
  text-align: right;
  font-size: 1.6rem;

  &:focus {
    border: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

export const ExchangeCardTitle = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
`;

export const ExchangeCardSubtitle = styled.span`
  font-size: 1.6rem;
  font-weight: normal;
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

export const SwapExchangeSide = styled(Img)`
  align-self: center;

  &:hover {
    cursor: pointer;
  }
`;
