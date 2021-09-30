import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { OptimalRate } from "paraswap-core";
import { useForm, useWatch } from "react-hook-form";
import { show } from "redux-modal";
import { BigNumber } from "@ethersproject/bignumber";
//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";
import {
  makeSelectTokenList,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import { Input, ErrorMessage, inputStyles } from "components/common/Form";
import { useLocalStorage } from "hooks";
import {
  PayTokenModal,
  ReceiveTokenModal,
  PAY_TOKEN_MODAL,
  RECEIVE_TOKEN_MODAL,
} from "./TokenSelectModal";
import { Card } from "components/common/Card";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import { constructLabel } from "utils/tokens";
import { useExchange } from "hooks/useExchange";
import { getAmountFromWei, getAmountInWei } from "utils/tx-helpers";
import { ExchangeDetails } from "./ExchangeDetails";
import { DEFAULT_SLIPPAGE } from "./constants";
import SwapIcon from "assets/icons/dashboard/swap-exchange-side.svg";
import { formatNumber } from "utils/number-helpers";
import { InfoCard } from "../People/styles";
import {
  ExchangePage,
  ExhangeContainer,
  ExchangeCard,
  ExchangeCardTitle,
  ExchangeGroup,
  ExchangeInputGroup,
  ExchangeInput,
  TokenUSDValue,
  SwapExchangeSide,
  ExchangeCardSubtitle,
  RouteLabel,
  RouteLablesContainer,
  RouteLables,
  RouteContainer,
  RouteLine,
  RouteLeftCurve,
  RouteRightCurve,
  RouteList,
  RouteNodes,
  RouteNode,
  TokenRouteNode,
  Route,
  RouteDotLabels,
  RouteLabelDot,
} from "./styles";

const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // ETH
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI

const DEFAULT_PAY_AMOUNT = "1";
const DEFAULT_RECEIVE_AMOUNT = "";
const DEFAULT_DESCRIPTION = "";

const PAY_TOKEN = "PAY_TOKEN";
const RECEIVE_TOKEN = "RECEIVE_TOKEN";

const PAY_AMOUNT = "PAY_AMOUNT";
const RECEIVE_AMOUNT = "RECEIVE_AMOUNT";
const DESCRIPTION = "DESCRIPTION";

const DEBOUNCE_TIMEOUT = 300; //ms

const getTokensByAddress = (tokenList: FixMe) =>
  tokenList.reduce((acc: FixMe, current: FixMe) => {
    if (current.symbol === "USD") {
      return acc;
    }
    const address = (current.address || ETH_ADDRESS).toLowerCase();
    acc[address] = current;
    return acc;
  }, {});

const getTokenLabel = (tokenDetails: FixMe) => {
  return tokenDetails
    ? constructLabel({
        token: tokenDetails.name,
        component: tokenDetails.symbol,
        imgUrl: tokenDetails.logoURI,
      })
    : "";
};

export default function Exchange() {
  const dispatch = useDispatch();
  const { getExchangeRate, approveAndSwap, error } = useExchange();

  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const organisationType = useSelector(makeSelectOrganisationType());

  const [payToken, setPayToken] = useState<string>(ETH_ADDRESS);
  const [receiveToken, setReceiveToken] = useState<string>(DAI_ADDRESS);
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [tokensByAddress, setTokensByAddress] = useState<FixMe>(
    getTokensByAddress([])
  );
  const [safeTokensByAddress, setSafeTokensByAddress] = useState<FixMe>(
    getTokensByAddress([])
  );
  const [loadingRate, setLoadingRate] = useState(false);
  const [rate, setRate] = useState<OptimalRate | null>(null);

  const [tokens, setTokens] = useState<FixMe[]>();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const safeTokenList = useSelector(makeSelectTokenList());
  const tokenDetails = useSelector(makeSelectTokensDetails());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getTokens(safeAddress));
    }
  }, [safeAddress, dispatch]);

  useEffect(() => {
    if (tokenDetails) {
      const transformedTokens = getTokensByAddress(Object.values(tokenDetails));

      setTokens(Object.values(transformedTokens));
      setTokensByAddress(transformedTokens);
    }
  }, [tokenDetails]);

  useEffect(() => {
    if (safeTokenList) {
      const transformedTokens = getTokensByAddress(safeTokenList);

      setSafeTokensByAddress(transformedTokens);
    }
  }, [safeTokenList]);

  const { register, errors, control, setValue, getValues } = useForm({
    mode: "onChange",
    defaultValues: {
      [PAY_AMOUNT]: DEFAULT_PAY_AMOUNT,
      [RECEIVE_AMOUNT]: DEFAULT_RECEIVE_AMOUNT,
      [DESCRIPTION]: DEFAULT_DESCRIPTION,
    },
  });

  const payTokenAmount = useWatch({
    control,
    name: PAY_AMOUNT,
    defaultValue: DEFAULT_PAY_AMOUNT,
  });
  const receiveTokenAmount = useWatch({
    control,
    name: RECEIVE_AMOUNT,
    defaultValue: DEFAULT_RECEIVE_AMOUNT,
  });

  // eslint-disable-next-line
  const updateExchangeRate = useCallback(
    debounce(async (amount: BigNumber) => {
      const exchangeRate = await getExchangeRate(
        payToken,
        receiveToken,
        amount
      );

      if (!exchangeRate) {
        setLoadingRate(false);
        return;
      }

      const { destAmount, destDecimals } = exchangeRate;

      setRate(exchangeRate);
      setValue(RECEIVE_AMOUNT, getAmountFromWei(destAmount, destDecimals, 8));
      setLoadingRate(false);
    }, DEBOUNCE_TIMEOUT),
    [payToken, receiveToken]
  );

  useEffect(() => {
    const tokenDetails = tokensByAddress[payToken];

    if (payTokenAmount && tokenDetails) {
      setRate(null);
      setLoadingRate(true);
      setValue(RECEIVE_AMOUNT, "");

      updateExchangeRate(getAmountInWei(payTokenAmount, tokenDetails.decimals));
    }
  }, [
    payToken,
    receiveToken,
    payTokenAmount,
    tokensByAddress,
    setValue,
    updateExchangeRate,
  ]);

  const onPayTokenClick = () => {
    dispatch(show(PAY_TOKEN_MODAL));
  };
  const onReceiveTokenClick = () => {
    dispatch(show(RECEIVE_TOKEN_MODAL));
  };

  const payTokenSelect = (tokenAddress: string) => {
    const checkedTokenAddress = tokenAddress || ETH_ADDRESS;

    if (checkedTokenAddress === receiveToken) {
      setReceiveToken(payToken);
    }

    setPayToken(checkedTokenAddress);
  };
  const receiveTokenSelect = (tokenAddress: string) => {
    const checkedTokenAddress = tokenAddress || ETH_ADDRESS;

    if (checkedTokenAddress === payToken) {
      setPayToken(receiveToken);
    }

    setReceiveToken(checkedTokenAddress);
  };

  const onExchangeClick = () => {
    const values = getValues();

    approveAndSwap(
      payToken,
      receiveToken,
      getAmountInWei(payTokenAmount, tokensByAddress[payToken].decimals),
      slippage,
      {
        to: cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify({
            description: values[DESCRIPTION]
              ? values[DESCRIPTION]
              : `Swapping ${payTokenAmount} ${tokensByAddress[payToken].symbol} for ${tokensByAddress[receiveToken].symbol}`,
          }),
          encryptionKey,
          organisationType
        ),
      }
    );
  };

  const onSlippageChange = (value: number) => {
    setSlippage(value);
  };

  const onSwapExhcangeSide = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
  };

  return (
    <>
      <ExchangePage>
        <InfoCard>
          <div>
            <div className="title">Exchange</div>
            <div className="subtitle">
              Trade tokens in a single transaction at the best price
            </div>
          </div>
        </InfoCard>

        <ExhangeContainer>
          <ExchangeCard>
            <ExchangeGroup>
              <ExchangeCardTitle>Pay with</ExchangeCardTitle>
              <ExchangeInputGroup>
                <div onClick={onPayTokenClick}>
                  <Select
                    name={PAY_TOKEN}
                    value={
                      payToken
                        ? {
                            value: payToken,
                            label: getTokenLabel(tokensByAddress[payToken]),
                          }
                        : null
                    }
                    styles={inputStyles}
                    width="12rem"
                    isSearchable={false}
                    menuIsOpen={false}
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>
                <TokenUSDValue>
                  {rate?.srcUSD
                    ? `~$${formatNumber(Number(rate?.srcUSD))}`
                    : ""}
                </TokenUSDValue>
                <ExchangeInput
                  type="number"
                  id={PAY_AMOUNT}
                  name={PAY_AMOUNT}
                  register={register}
                  placeholder=""
                  step="any"
                />
              </ExchangeInputGroup>
              {/*<div>*/}
              {/*  Balance: {safeTokensByAddress?.[payToken]?.balance || 0}*/}
              {/*</div>*/}
              {/*<div>USD: {rate?.srcUSD || "-"}</div>*/}

              <ErrorMessage name="name" errors={errors} />
            </ExchangeGroup>
            <SwapExchangeSide
              onClick={onSwapExhcangeSide}
              src={SwapIcon}
              alt="swap-side"
              width={30}
            />
            <ExchangeGroup>
              <ExchangeCardTitle>Receive</ExchangeCardTitle>
              <ExchangeInputGroup>
                <div onClick={onReceiveTokenClick}>
                  <Select
                    name={RECEIVE_TOKEN}
                    value={
                      receiveToken
                        ? {
                            value: receiveToken,
                            label: getTokenLabel(tokensByAddress[receiveToken]),
                          }
                        : null
                    }
                    styles={inputStyles}
                    width="12rem"
                    isSearchable={false}
                    menuIsOpen={false}
                  />
                </div>
                <TokenUSDValue>
                  {rate?.destUSD
                    ? `~$${formatNumber(Number(rate?.destUSD))}`
                    : ""}
                </TokenUSDValue>
                <ExchangeInput
                  type="number"
                  id={RECEIVE_AMOUNT}
                  name={RECEIVE_AMOUNT}
                  register={register}
                  placeholder=""
                  disabled={true}
                  step="any"
                />
              </ExchangeInputGroup>
              {/*<div>*/}
              {/*  Balance: {safeTokensByAddress?.[receiveToken]?.balance || 0}*/}
              {/*</div>*/}
              {/*<div>USD: {rate?.destUSD || "-"}</div>*/}
            </ExchangeGroup>
            <ExchangeGroup>
              <ExchangeCardTitle>
                Description{" "}
                <ExchangeCardSubtitle>(optional)</ExchangeCardSubtitle>
              </ExchangeCardTitle>
              <Input
                type="text"
                id={DESCRIPTION}
                name={DESCRIPTION}
                register={register}
                placeholder="Enter description"
                autoComplete="off"
              />
            </ExchangeGroup>
          </ExchangeCard>
          <ExchangeDetails
            {...{
              loading: loadingRate,
              payTokenDetails: tokensByAddress?.[payToken],
              receiveTokenDetails: tokensByAddress?.[receiveToken],
              payTokenAmount,
              receiveTokenAmount,
              rate,
              slippage,
              onSlippageChange,
              onExchangeClick,
              error,
            }}
          />
        </ExhangeContainer>
        {!loadingRate && rate ? (
          <Card>
            <ExchangeGroup>
              <ExchangeCardTitle>Order Routing</ExchangeCardTitle>
              <RouteLablesContainer>
                <RouteLables>
                  <div>
                    <RouteLabel>
                      <img
                        src={tokensByAddress[payToken].logoURI}
                        alt={tokensByAddress[payToken].name}
                        width="16"
                      />
                      <div>
                        {payTokenAmount} {tokensByAddress[payToken].symbol}
                      </div>
                    </RouteLabel>
                  </div>
                  <div>
                    <RouteLabel>
                      <div>
                        {receiveTokenAmount}{" "}
                        {tokensByAddress[receiveToken].symbol}
                      </div>
                      <img
                        src={tokensByAddress[receiveToken].logoURI}
                        alt={tokensByAddress[receiveToken].name}
                        width="16"
                      />
                    </RouteLabel>
                  </div>
                </RouteLables>
                <RouteDotLabels>
                  <RouteLabelDot />
                  <RouteLabelDot />
                </RouteDotLabels>
              </RouteLablesContainer>
              <RouteList>
                {rate.bestRoute.map(({ percent, swaps }, index) => {
                  return (
                    <RouteContainer key={`${index}${percent}`}>
                      <RouteLine
                        width="100%"
                        height="2"
                        viewBox="0 0 100 2"
                        fill="none"
                        preserveAspectRatio="xMinYMid meet"
                        stroke="#B7CDFB"
                      >
                        <path
                          d="M0 1C240.5 1 9999 1 9999 1"
                          strokeDasharray="4 4"
                        ></path>
                      </RouteLine>
                      <Route>
                        <RouteLeftCurve
                          width="42"
                          height="74"
                          viewBox="0 0 42 74"
                          fill="none"
                        >
                          <path
                            d="M1 0V61C1 67.6274 6.37258 73 13 73H42"
                            stroke="#B7CDFB"
                            strokeDasharray="4 4"
                          ></path>
                        </RouteLeftCurve>
                        <RouteRightCurve
                          width="42"
                          height="74"
                          viewBox="0 0 42 74"
                          fill="none"
                        >
                          <path
                            d="M1 0V61C1 67.6274 6.37258 73 13 73H42"
                            stroke="#B7CDFB"
                            strokeDasharray="4 4"
                          ></path>
                        </RouteRightCurve>
                        <RouteNode>{percent}%</RouteNode>
                        <RouteNodes>
                          {swaps.map(({ srcToken, destToken }, index) => {
                            const previousToken = swaps[index - 1]?.destToken;

                            const src = tokensByAddress[srcToken.toLowerCase()];
                            const dest =
                              tokensByAddress[destToken.toLowerCase()];

                            const srcTokenLabel =
                              previousToken === srcToken ? null : (
                                <TokenRouteNode>
                                  {getTokenLabel(src)}
                                </TokenRouteNode>
                              );

                            return (
                              <React.Fragment key={`${index}${destToken}`}>
                                {srcTokenLabel}
                                <TokenRouteNode>
                                  {getTokenLabel(dest)}
                                </TokenRouteNode>
                              </React.Fragment>
                            );
                          })}
                        </RouteNodes>
                        <RouteNode>{percent}%</RouteNode>
                      </Route>
                    </RouteContainer>
                  );
                })}
              </RouteList>
            </ExchangeGroup>
          </Card>
        ) : null}
      </ExchangePage>
      <PayTokenModal
        title="Pay with"
        tokenList={tokens}
        safeTokensByAddress={safeTokensByAddress}
        onTokenSelect={payTokenSelect}
      />
      <ReceiveTokenModal
        title="Receive"
        tokenList={tokens}
        safeTokensByAddress={safeTokensByAddress}
        onTokenSelect={receiveTokenSelect}
      />
    </>
  );
}
