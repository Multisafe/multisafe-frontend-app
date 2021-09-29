import React from "react";
import { OptimalRate } from "paraswap-core";
import Button from "../common/Button";
import Loading from "../common/Loading";
import { formatNumber } from "utils/number-helpers";
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
};

const getOneTokenPrice = (payAmount: FixMe, receiveAmount: FixMe) => {
  return formatNumber(receiveAmount / payAmount);
};

const CUSTOM_SLIPPAGE = "CUSTOM_SLIPPAGE";

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
                <div>
                  {String(receiveTokenAmount)} {receiveTokenDetails?.symbol}
                </div>
              </ExchangeDetailsGroup>
              <ExchangeDetailsGroup>
                <div>Rate</div>
                <div>
                  1 {receiveTokenDetails?.symbol} ={" "}
                  {getOneTokenPrice(receiveTokenAmount, payTokenAmount)}{" "}
                  {payTokenDetails?.symbol}
                </div>
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
            <ExhcangeSettings
              {...{
                error,
                slippage,
                onSlippageChange,
              }}
            />
          </DetailsContainer>
          <ExchangeControlsContainer>
            <ExchangeError>{error}</ExchangeError>
            <ExchangeControls>
              <Button onClick={onExchangeClick}>Exchange</Button>
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
  onSlippageChange,
  error,
}: SettingsProps) => {
  const transformedCustomSlippage = Number(slippage);

  const onChange = (e: FixMe) => {
    onSlippageChange(Number(e.target.value));
  };

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
          />
        </ExchangeControls>
        {transformedCustomSlippage > 1 ? (
          <ExchangeWarning>Your transaction may be frontrun</ExchangeWarning>
        ) : null}
      </ExchangeGroup>
    </>
  );
};
