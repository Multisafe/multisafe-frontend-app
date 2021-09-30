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

export const TokenUSDValue = styled.div`
  font-size: 1.2rem;
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

export const RouteLablesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  background-color: white;
  z-index: 1;
`;

export const RouteLabel = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  font-size: 1.6rem;
`;

export const RouteLables = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const RouteDotLabels = styled(RouteLables)`
  padding: 0 4px;
`;

export const RouteLabelDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #1452f5;
`;

export const SrcLabelDot = styled(RouteLabelDot)`
  position: relative;
  left: 4px;
`;

export const DestLabelDot = styled(RouteLabelDot)`
  position: relative;
  right: 4px;
`;

export const RouteContainer = styled.div`
  position: relative;
  margin: 0 54px;
`;

export const RouteLine = styled.svg`
  position: absolute;
  top: 50%;
  left: 0;
`;

export const RouteLeftCurve = styled.svg`
  position: absolute;
  bottom: 12px;
  left: -47px;
`;

export const RouteRightCurve = styled.svg`
  position: absolute;
  bottom: 12px;
  right: -47px;
  transform: scaleX(-1);
`;

export const RouteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  margin-top: 16px;
`;

export const Route = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RouteNodes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  padding: 0 4rem;
  font-size: 1.2rem;
`;

export const RouteNode = styled.div`
  z-index: 1;
  min-width: 24px;
  text-align: center;
  padding: 0.6rem 0.8rem;
  background-color: white;
`;

export const TokenRouteNode = styled(RouteNode)`
  background-color: #f6f8fa;
  border-radius: 4px;
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ExchangeError = styled.div`
  font-size: 1.6rem;
  color: #ff4b55;
`;

export const ExchangeWarning = styled.div`
  font-size: 1.6rem;
  color: #fcbc04;
`;

export const SlippageInput = styled(Input)`
  width: 8rem;
`;
