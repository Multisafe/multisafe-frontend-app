import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OptimalRate } from "paraswap-core";
import { useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
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
import { DEFAULT_SLIPPAGE } from "./constants";

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

const formatPrice = (num: number) =>
  num >= 1 ? num.toFixed(2) : num.toFixed(18).replace(/(\.\d{1,4})\d+/, "$1");

const VIEWS = {
  DETAILS: "DETAILS",
  SETTINGS: "SETTINGS",
};

const CUSTOM_SLIPPAGE = "CUSTOM_SLIPPAGE";

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
      ) : view === VIEWS.DETAILS ? (
        <>
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
      ) : (
        <ExhcangeSettings
          {...{
            error,
            slippage,
            onSlippageChange,
            toggleView,
          }}
        />
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
  toggleView,
  error,
}: SettingsProps) => {
  const { register, errors, control, formState, setValue } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    setValue(CUSTOM_SLIPPAGE, slippage);
  }, [slippage]);

  const customSlippage = useWatch({
    control,
    name: CUSTOM_SLIPPAGE,
    defaultValue: slippage,
  });
  const transformedCustomSlippage = Number(customSlippage);

  const setSlippage = (value: number) => {
    setValue(CUSTOM_SLIPPAGE, value);
  };

  const saveSettings = () => {
    onSlippageChange(transformedCustomSlippage);
    toggleView();
  };

  const resetSettings = () => {
    setValue(CUSTOM_SLIPPAGE, slippage);
  };

  const onBackClick = () => {
    resetSettings();
    toggleView();
  };

  return (
    <>
      <ExchangeGroup>
        <ExchangeCardTitle>Slippage</ExchangeCardTitle>
        <ExchangeControls>
          <SlippageInput
            type="number"
            id={CUSTOM_SLIPPAGE}
            name={CUSTOM_SLIPPAGE}
            register={register}
            placeholder=""
            step="any"
          />
          <Button
            className={transformedCustomSlippage === 1 ? "" : "secondary-3"}
            onClick={() => setSlippage(1)}
          >
            1%
          </Button>
          <Button
            className={transformedCustomSlippage === 2 ? "" : "secondary-3"}
            onClick={() => setSlippage(2)}
          >
            2%
          </Button>
        </ExchangeControls>
        {customSlippage > 1 ? (
          <ExchangeWarning>Your transaction may be frontrun</ExchangeWarning>
        ) : null}
      </ExchangeGroup>
      <ExchangeControlsContainer>
        <ExchangeError>{error}</ExchangeError>
        <ExchangeControls>
          <Button className="secondary-2" onClick={onBackClick}>
            Back
          </Button>
          <Button
            disabled={transformedCustomSlippage === slippage}
            onClick={saveSettings}
          >
            Save
          </Button>
        </ExchangeControls>
      </ExchangeControlsContainer>
    </>
  );
};
