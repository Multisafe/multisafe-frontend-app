import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import { Input, inputStyles } from "components/common/Form";
import Img from "components/common/Img";
import { useLocalStorage } from "hooks";
import {
  PayTokenModal,
  ReceiveTokenModal,
  PAY_TOKEN_MODAL,
  RECEIVE_TOKEN_MODAL,
} from "./TokenSelectModal";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import { constructLabel } from "utils/tokens";
import { useExchange } from "hooks/useExchange";
import { getAmountFromWei, getAmountInWei } from "utils/tx-helpers";
import { ExchangeDetails } from "./ExchangeDetails";
import { DEFAULT_SLIPPAGE, ETH_ADDRESS, DAI_ADDRESS } from "./constants";
import SwapIcon from "assets/icons/dashboard/swap-exchange-side.svg";
import { formatNumber } from "utils/number-helpers";
import { InfoCard } from "../People/styles";
import {
  ExchangePage,
  ExchangeContainer,
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
  TitleGroup,
  TokenBalance,
  RouteCard,
} from "./styles";
import { ExchangeAlert } from "./ExchangeAlert";
import {useActiveWeb3React} from '../../hooks';

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
  const { getExchangeRate, approveAndSwap, error, loadingSwap, loadingTx } =
    useExchange();
  const {chainId} = useActiveWeb3React();

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
      dispatch(getTokens(safeAddress, chainId));
    }
  }, [safeAddress, dispatch, chainId]);

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

  const { register, control, setValue, getValues } = useForm({
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
        tokensByAddress[payToken]?.decimals || 18,
        receiveToken,
        tokensByAddress[receiveToken]?.decimals || 18,
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
      tokensByAddress[payToken]?.decimals || 18,
      receiveToken,
      tokensByAddress[receiveToken]?.decimals || 18,
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
        tokenValue: Number(payTokenAmount),
        tokenCurrency: tokensByAddress[payToken].symbol,
        metaData: {
          payToken,
          payTokenSymbol: tokensByAddress[payToken].symbol,
          payTokenAmount,
          receiveToken,
          receiveTokenSymbol: tokensByAddress[receiveToken].symbol,
          slippage,
          serviceFee: 0, // Coinshift fee
        },
      }
    );
  };

  const onSlippageChange = (value: number) => {
    setSlippage(value);
  };

  const onSwapExchangeSide = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
  };

  const safeTokens = useMemo(() => {
    return Object.keys(safeTokensByAddress).flatMap((address: string) =>
      tokensByAddress[address] ? [tokensByAddress[address]] : []
    );
  }, [safeTokensByAddress, tokensByAddress]);

  const payTokenBalance = safeTokensByAddress?.[payToken]?.balance || 0;
  const receiveTokenBalance = safeTokensByAddress?.[receiveToken]?.balance || 0;
  const insufficientBalance = payTokenAmount > payTokenBalance;

  const swapDisabled = insufficientBalance || slippage > 100 || slippage < 0;

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
        <ExchangeAlert />
        <ExchangeContainer>
          <ExchangeCard>
            <ExchangeGroup>
              <TitleGroup>
                <ExchangeCardTitle>Pay with</ExchangeCardTitle>
                {tokensByAddress[payToken] ? (
                  <TokenBalance insufficientBalance={insufficientBalance}>
                    Balance: {payTokenBalance}{" "}
                    {tokensByAddress[payToken].symbol}
                  </TokenBalance>
                ) : null}
              </TitleGroup>
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
            </ExchangeGroup>
            <SwapExchangeSide
              onClick={onSwapExchangeSide}
              src={SwapIcon}
              alt="swap-side"
              width={30}
            />
            <ExchangeGroup>
              <TitleGroup>
                <ExchangeCardTitle>Receive</ExchangeCardTitle>
                {tokensByAddress[receiveToken] ? (
                  <TokenBalance>
                    Balance: {receiveTokenBalance}{" "}
                    {tokensByAddress[receiveToken].symbol}
                  </TokenBalance>
                ) : null}
              </TitleGroup>
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
              swapDisabled,
              swapLoading: loadingSwap || loadingTx,
            }}
          />
        </ExchangeContainer>
        {!loadingRate && rate ? (
          <RouteCard>
            <ExchangeGroup>
              <ExchangeCardTitle>Order Routing</ExchangeCardTitle>
              <RouteLablesContainer>
                <RouteLables>
                  <div>
                    <RouteLabel>
                      <Img
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
                      <Img
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
          </RouteCard>
        ) : null}
      </ExchangePage>
      <PayTokenModal
        title="Pay with"
        tokenList={safeTokens}
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
