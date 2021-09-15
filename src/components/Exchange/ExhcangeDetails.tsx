import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
  ExchangeGroup,
  ExchangeDetailsGroup,
  ExchangeControls,
  LoadingRateContainer,
  ExchangeDetailsCard,
  ExchangeControlsContainer
} from './styles';
import Button from '../common/Button';
import Loading from '../common/Loading';
import SettingsIcon from 'assets/icons/sidebar/settings-icon.svg';
import Img from '../common/Img';
import {OptimalRate} from 'paraswap-core';
import {useSelector} from 'react-redux';
import {makeSelectGasMode} from 'store/global/selectors';

type Props = {
  loading?: boolean,
  payTokenDetails: FixMe,
  receiveTokenDetails: FixMe,
  payTokenAmount: string,
  rate: OptimalRate | null,
  receiveTokenAmount: string,
  onExchangeClick: () => void,
  slippage: number,
  onSlippageChange: (value: number) => void,
  error: string
};

const getOneTokenPrice = (payAmount: FixMe, receiveAmount: FixMe) => {
  return formatPrice(receiveAmount/payAmount);
};

const formatPrice = (num: number) =>
  num >= 1 ? num.toFixed(2) : num.toFixed(18).replace(/(\.\d{1,4})\d+/, '$1');

const VIEWS = {
  DETAILS: 'DETAILS',
  SETTINGS: 'SETTINGS'
};

const ExchangeSettingsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
`;

const ExchangeError = styled.div`
  font-size: 1.6rem;
  color: #ff4b55;
`;

export const ExchangeDetails = (props: Props) => {
  const {
    error,
    loading,
    payTokenDetails,
    receiveTokenDetails,
    payTokenAmount,
    receiveTokenAmount,
    rate,
    onExchangeClick,
    slippage,
    onSlippageChange
  } = props;

  const [view, setView] = useState(VIEWS.DETAILS);

  const selectedGasMode = useSelector(makeSelectGasMode());

  useEffect(() => {
    setView(VIEWS.DETAILS);
  }, [loading]);

  const toggleView = () => {
    setView(view === VIEWS.DETAILS ? VIEWS.SETTINGS : VIEWS.DETAILS)
  };

  return (
    <ExchangeDetailsCard>
      {loading ? (
        <LoadingRateContainer>
          <Loading color="primary" width="3rem" height="3rem"/>
        </LoadingRateContainer>
      ) : (
        view === VIEWS.DETAILS ? (
          <>
            <ExchangeGroup>
              <ExchangeDetailsGroup>
                <div>Min. Received</div>
                <div>{String(receiveTokenAmount)} {receiveTokenDetails?.symbol}</div>
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Rate</div>
                <div>1 {receiveTokenDetails?.symbol} = {getOneTokenPrice(receiveTokenAmount, payTokenAmount)} {payTokenDetails?.symbol}</div>
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Price Slippage</div>
                <div>{slippage}%</div>
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Network Fee</div>
                <div>${rate?.gasCostUSD} · Fast</div>
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>MultiSafe Fee</div>
                <div>$0</div>
              </ExchangeDetailsGroup>
            </ExchangeGroup>
            <ExchangeControlsContainer>
              <ExchangeError>{error}</ExchangeError>
              <ExchangeControls>
                <Button className="secondary-2" onClick={toggleView}>
                  <Img src={SettingsIcon} alt="settings"/>
                </Button>
                <Button onClick={onExchangeClick}>Exchange</Button>
              </ExchangeControls>
            </ExchangeControlsContainer>
          </>
        ) : (
          <>
            <ExchangeSettingsGroup>
              <div>Slippage</div>
              <ExchangeControls>
                <Button className="secondary-2" onClick={() => onSlippageChange(0.5)}>.5%</Button>
                <Button className="secondary-2" onClick={() => onSlippageChange(1)}>1%</Button>
                <Button className="secondary-2" onClick={() => onSlippageChange(2)}>2%</Button>
              </ExchangeControls>
            </ExchangeSettingsGroup>
            <ExchangeControlsContainer>
              <ExchangeError>{error}</ExchangeError>
              <ExchangeControls>
                <Button className="secondary-2" onClick={toggleView}>Back</Button>
              </ExchangeControls>
            </ExchangeControlsContainer>
          </>
        )
      )}
    </ExchangeDetailsCard>
  );
}
