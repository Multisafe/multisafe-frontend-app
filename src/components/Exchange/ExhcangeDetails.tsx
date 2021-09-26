import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OptimalRate } from "paraswap-core";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import { Input, ErrorMessage } from "components/common/Form";
import {
  ExchangeCardTitle,
  ExchangeGroup,
  ExchangeDetailsGroup,
  ExchangeControls,
  LoadingRateContainer,
  ExchangeDetailsCard,
  ExchangeControlsContainer,
} from "./styles";
import Button from "../common/Button";
import Loading from "../common/Loading";
import SettingsIcon from "assets/icons/sidebar/settings-icon.svg";
import Img from "../common/Img";
import { makeSelectGasMode } from "store/global/selectors";
import { formatPrice } from "./utils";

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
  return formatPrice(receiveAmount / payAmount);
};

const VIEWS = {
  DETAILS: "DETAILS",
  SETTINGS: "SETTINGS",
};

const CUSTOM_SLIPPAGE = "CUSTOM_SLIPPAGE";

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ExchangeError = styled.div`
  font-size: 1.6rem;
  color: #ff4b55;
`;

const ExchangeWarning = styled.div`
  font-size: 1.6rem;
  color: #fcbc04;
`;

const SlippageInput = styled(Input)`
  width: 12rem;
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
    onSlippageChange,
  } = props;

  const [view, setView] = useState(VIEWS.DETAILS);

  const selectedGasMode = useSelector(makeSelectGasMode());

  useEffect(() => {
    setView(VIEWS.DETAILS);
  }, [loading]);

  const toggleView = () => {
    setView(view === VIEWS.DETAILS ? VIEWS.SETTINGS : VIEWS.DETAILS);
  };

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
                toggleView,
              }}
            />
          </DetailsContainer>
          <ExchangeControlsContainer>
            <ExchangeError>{error}</ExchangeError>
            <ExchangeControls>
              <Button className="secondary-2" onClick={toggleView}>
                <Img src={SettingsIcon} alt="settings" width={16} />
              </Button>
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
  toggleView: () => void;
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
