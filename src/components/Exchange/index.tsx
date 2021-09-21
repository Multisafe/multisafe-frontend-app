import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import { InfoCard } from "../People/styles";
import { useDispatch, useSelector } from "react-redux";
import { OptimalRate } from "paraswap-core";
import {
  makeSelectTokenList,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import { useForm, useWatch } from "react-hook-form";
//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";
import {
  ExchangePage,
  ExhangeContainer,
  ExchangeCard,
  ExchangeCardTitle,
  ExchangeGroup,
  ExchangeInputGroup,
} from "./styles";
import { inputStyles } from "../common/Form";
import { Input, ErrorMessage } from "components/common/Form";
import { useLocalStorage } from "hooks";
import {
  PayTokenModal,
  ReceiveTokenModal,
  PAY_TOKEN_MODAL,
  RECEIVE_TOKEN_MODAL,
} from "./TokenSelectModal";
import {makeSelectOrganisationType, makeSelectOwnerSafeAddress} from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import { constructLabel } from "utils/tokens";
import { show } from "redux-modal";
import { useExchange } from "hooks/useExchange";
import { getAmountFromWei, getAmountInWei } from "utils/tx-helpers";
import { BigNumber } from "@ethersproject/bignumber";
import { ExchangeDetails } from "./ExhcangeDetails";
import { DEFAULT_SLIPPAGE } from "./constants";

const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // ETH
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI

const DEFAULT_PAY_AMOUNT = "1";
const DEFAULT_RECEIVE_AMOUNT = "";

const PAY_TOKEN = "PAY_TOKEN";
const RECEIVE_TOKEN = "RECEIVE_TOKEN";

const PAY_AMOUNT = "PAY_AMOUNT";
const RECEIVE_AMOUNT = "RECEIVE_AMOUNT";

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

  const { register, errors, control, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      [PAY_AMOUNT]: DEFAULT_PAY_AMOUNT,
      [RECEIVE_AMOUNT]: DEFAULT_RECEIVE_AMOUNT,
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
  }, [payToken, receiveToken, payTokenAmount, tokensByAddress]);

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
    approveAndSwap(
      payToken,
      receiveToken,
      getAmountInWei(payTokenAmount, tokensByAddress[payToken].decimals),
      slippage,
      {
        to: cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify({
            description: `Swapping ${payTokenAmount} ${tokensByAddress[payToken].symbol} for ${tokensByAddress[receiveToken].symbol}`
          }),
          encryptionKey,
          organisationType
        )
      }
    );
  };

  const onSlippageChange = (value: number) => {
    setSlippage(value);
  };

  return (
    <>
      <ExchangePage>
        <InfoCard>
          <div>
            <div className="title">Exchange</div>
            <div className="subtitle">
              Trade any token, LP share or Vault in a single transaction
            </div>
          </div>
        </InfoCard>

        <ExhangeContainer>
          <ExchangeCard>
            <ExchangeGroup>
              <ExchangeCardTitle>Pay with</ExchangeCardTitle>
              <ExchangeInputGroup>
                <ExchangeGroup>
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
                      width="16rem"
                      isSearchable={false}
                      menuIsOpen={false}
                      className="basic-single"
                      classNamePrefix="select"
                    />
                  </div>
                  <div>
                    Balance: {safeTokensByAddress?.[payToken]?.balance || 0}
                  </div>
                </ExchangeGroup>
                <ExchangeGroup>
                  <Input
                    type="number"
                    id={PAY_AMOUNT}
                    name={PAY_AMOUNT}
                    register={register}
                    placeholder=""
                    step="any"
                  />
                  <div>USD: {rate?.srcUSD || "-"}</div>
                </ExchangeGroup>
              </ExchangeInputGroup>
              <ErrorMessage name="name" errors={errors} />
            </ExchangeGroup>
            <ExchangeGroup>
              <ExchangeCardTitle>Receive</ExchangeCardTitle>
              <ExchangeInputGroup>
                <ExchangeGroup>
                  <div onClick={onReceiveTokenClick}>
                    <Select
                      name={RECEIVE_TOKEN}
                      value={
                        receiveToken
                          ? {
                              value: receiveToken,
                              label: getTokenLabel(
                                tokensByAddress[receiveToken]
                              ),
                            }
                          : null
                      }
                      styles={inputStyles}
                      width="16rem"
                      isSearchable={false}
                      menuIsOpen={false}
                    />
                  </div>
                  <div>
                    Balance: {safeTokensByAddress?.[receiveToken]?.balance || 0}
                  </div>
                </ExchangeGroup>
                <ExchangeGroup>
                  <Input
                    type="number"
                    id={RECEIVE_AMOUNT}
                    name={RECEIVE_AMOUNT}
                    register={register}
                    placeholder=""
                    disabled={true}
                    step="any"
                  />
                  <div>USD: {rate?.destUSD || "-"}</div>
                </ExchangeGroup>
              </ExchangeInputGroup>
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
