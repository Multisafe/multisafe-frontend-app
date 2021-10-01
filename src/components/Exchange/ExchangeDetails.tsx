import React from "react";
import { OptimalRate } from "paraswap-core";
import Button from "components/common/Button";
import Loading from "components/common/Loading";
import { formatNumber } from "utils/number-helpers";
import {DEFAULT_SLIPPAGE} from './constants';
import {
  SlippageInput,
  ExchangeWarning,
  ExchangeError,
  DetailsContainer,
  ExchangeCardTitle,
  ExchangeGroup,
  ExchangeDetailsGroup,
  ExchangeControls,
  LoadingRateContainer,
  ExchangeDetailsCard,
  ExchangeControlsContainer,
  ExchangeButton,
} from "./styles";

type Props = {
  loading?: boolean;
  payTokenDetails: FixMe;
  receiveTokenDetails: FixMe;
  payTokenAmount: string;
  rate: OptimalRate | null;
  receiveTokenAmount: string;
  onExchangeClick: () => void;
  slippage: number;
  onSlippageChange: (value: number) => void;
  error: string;
  swapDisabled: boolean;
  swapLoading: boolean;
};

const getOneTokenPrice = (payAmount: FixMe, receiveAmount: FixMe) => {
  return formatNumber(receiveAmount / payAmount);
};

const CUSTOM_SLIPPAGE = "CUSTOM_SLIPPAGE";

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'ESTIMATED_LOSS_GREATER_THAN_MAX_IMPACT':
      return 'Price Impact Too High';

    default:
      return error;
  }
}

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
    onSlippageChange,
    swapDisabled,
    swapLoading
  } = props;

  return (
    <ExchangeDetailsCard>
      {loading ? (
        <LoadingRateContainer>
          <Loading color="primary" width="3rem" height="3rem" />
        </LoadingRateContainer>
      ) : (
        <>
          <DetailsContainer>
            <ExchangeGroup>
              <ExchangeDetailsGroup>
                <div>Min. Received</div>
                {receiveTokenAmount ? (
                  <div>
                    {String(receiveTokenAmount)} {receiveTokenDetails?.symbol}
                  </div>
                ) : (
                  <div>-</div>
                )}
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Rate</div>
                {receiveTokenAmount ? (
                  <div>
                    1 {receiveTokenDetails?.symbol} ={" "}
                    {getOneTokenPrice(receiveTokenAmount, payTokenAmount)}{" "}
                    {payTokenDetails?.symbol}
                  </div>
                ) : (
                  <div>-</div>
                )}
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Price Slippage</div>
                <div>{slippage}%</div>
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Network Fee</div>
                {rate ? (
                  <div>~${formatNumber(rate.gasCostUSD)}</div>
                ) : (
                  <div>-</div>
                )}
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Coinshift Fee</div>
                <div>$0</div>
              </ExchangeDetailsGroup>
            </ExchangeGroup>
            <ExhcangeSettings
              {...{
                error,
                slippage,
                onSlippageChange,
              }}
            />
          </DetailsContainer>
          <ExchangeControlsContainer>
            <ExchangeError>{getErrorMessage(error)}</ExchangeError>
            <ExchangeControls>
              <ExchangeButton loading={swapLoading} disabled={swapDisabled || swapLoading} onClick={onExchangeClick}>Exchange</ExchangeButton>
            </ExchangeControls>
          </ExchangeControlsContainer>
        </>
      )}
    </ExchangeDetailsCard>
  );
};

type SettingsProps = {
  slippage: number;
  onSlippageChange: (value: number) => void;
  error: string;
};

const ExhcangeSettings = ({
  slippage,
  onSlippageChange
}: SettingsProps) => {
  const transformedCustomSlippage = Number(slippage);

  const onChange = (e: FixMe) => {
    const value = e.target.value;
    onSlippageChange(value ? Number(value) : value);
  };

  const onBlur = () => {
    if (!slippage) {
      onSlippageChange(DEFAULT_SLIPPAGE);
    }
  }

  return (
    <>
      <ExchangeGroup>
        <ExchangeCardTitle>Slippage</ExchangeCardTitle>
        <ExchangeControls>
          <Button
            className={transformedCustomSlippage === 1 ? "" : "secondary-3"}
            onClick={() => onSlippageChange(1)}
          >
            1%
          </Button>
          <Button
            className={transformedCustomSlippage === 2 ? "" : "secondary-3"}
            onClick={() => onSlippageChange(2)}
          >
            2%
          </Button>
          <SlippageInput
            type="number"
            id={CUSTOM_SLIPPAGE}
            name={CUSTOM_SLIPPAGE}
            value={slippage}
            onChange={onChange}
            placeholder=""
            step="any"
            max={100}
            onBlur={onBlur}
          />
        </ExchangeControls>
        {slippage > 100 ? (
          <ExchangeError>Incorrect slippage</ExchangeError>
        ) : (
          transformedCustomSlippage > 1 ? (
            <ExchangeWarning>Your transaction may be frontrun</ExchangeWarning>
          ) : null
        )}
      </ExchangeGroup>
    </>
  );
};
