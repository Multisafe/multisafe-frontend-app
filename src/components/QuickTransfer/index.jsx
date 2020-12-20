import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { BigNumber } from "@ethersproject/bignumber";
import { cryptoUtils } from "parcel-sdk";

import TransactionSubmitted from "components/Payments/TransactionSubmitted";
import { Info } from "components/Dashboard/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import Img from "components/common/Img";
import { Input, ErrorMessage, Select, TextArea } from "components/common/Form";
import { useMassPayout, useLocalStorage } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { addTransaction } from "store/transactions/actions";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import dashboardReducer from "store/dashboard/reducer";
import marketRatesReducer from "store/market-rates/reducer";
import dashboardSaga from "store/dashboard/saga";
import marketRatesSaga from "store/market-rates/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getSafeBalances } from "store/dashboard/actions";
import {
  makeSelectLoading,
  makeSelectBalances,
  // makeSelectError,
} from "store/dashboard/selectors";
import { makeSelectPrices } from "store/market-rates/selectors";
import Loading from "components/common/Loading";
import { getMarketRates } from "store/market-rates/actions";
import { tokens } from "constants/index";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import {
  Container,
  Title,
  Heading,
  StepsCard,
  ActionItem,
} from "components/People/styles";
import { ShowToken } from "./styles";
import { Circle } from "components/Header/styles";

const dashboardKey = "dashboard";
const marketRatesKey = "marketRates";
const transactionsKey = "transactions";

const DEFAULT_TOKENS = {
  ETH: "ETH",
  DAI: "DAI",
  USDC: "USDC",
};

const defaultTokenDetails = [
  {
    id: 0,
    name: DEFAULT_TOKENS.ETH,
    icon: ETHIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 1,
    name: DEFAULT_TOKENS.DAI,
    icon: DAIIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 2,
    name: DEFAULT_TOKENS.USDC,
    icon: USDCIcon,
    balance: "0.00",
    usd: "0.00",
  },
];

export default function QuickTransfer() {
  const [sign] = useLocalStorage("SIGNATURE");

  const { txHash, loadingTx, massPayout } = useMassPayout();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  // eslint-disable-next-line
  const [selectedTokenName, setSelectedTokenName] = useState(
    DEFAULT_TOKENS.DAI
  );
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);
  const [payoutDetails, setPayoutDetails] = useState(null);

  // Reducers
  useInjectReducer({ key: dashboardKey, reducer: dashboardReducer });
  useInjectReducer({ key: marketRatesKey, reducer: marketRatesReducer });
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  // Sagas
  useInjectSaga({ key: dashboardKey, saga: dashboardSaga });
  useInjectSaga({ key: marketRatesKey, saga: marketRatesSaga });
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const history = useHistory();

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const balances = useSelector(makeSelectBalances());
  const prices = useSelector(makeSelectPrices());

  useEffect(() => {
    setSelectedTokenDetails(
      tokenDetails.filter(({ name }) => name === selectedTokenName)[0]
    );
  }, [tokenDetails, selectedTokenName]);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getSafeBalances(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    dispatch(getMarketRates());
  }, [dispatch]);

  const totalAmountToPay = useMemo(() => {
    if (prices && payoutDetails && payoutDetails.length > 0) {
      return payoutDetails.reduce(
        (total, { salaryAmount, salaryToken }) =>
          (total += prices[salaryToken] * salaryAmount),
        0
      );
    }

    return 0;
  }, [prices, payoutDetails]);

  useEffect(() => {
    if (txHash) {
      setSubmittedTx(true);
      if (sign && payoutDetails && ownerSafeAddress && totalAmountToPay) {
        const to = cryptoUtils.encryptData(JSON.stringify(payoutDetails), sign);
        // const to = selectedTeammates;

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: ownerSafeAddress,
            transactionHash: txHash,
            tokenValue: totalAmountToPay,
            tokenCurrency: tokens.DAI,
            fiatValue: totalAmountToPay,
            addresses: payoutDetails.map(({ address }) => address),
            transactionMode: 1, // quick transfer
          })
        );
      }
    }
  }, [
    txHash,
    sign,
    payoutDetails,
    dispatch,
    ownerSafeAddress,
    totalAmountToPay,
  ]);

  const getDefaultIconIfPossible = (tokenSymbol) => {
    switch (tokenSymbol) {
      case "DAI":
        return DAIIcon;
      case "USDC":
        return USDCIcon;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (balances && balances.length > 0 && prices) {
      const seenTokens = {};
      const allTokenDetails = balances
        .map((bal, idx) => {
          // erc20
          if (bal.token && bal.tokenAddress) {
            const balance = BigNumber.from(bal.balance)
              .div(BigNumber.from(String(10 ** bal.token.decimals)))
              .toString();
            // mark as seen
            seenTokens[bal.token.symbol] = true;
            const tokenIcon = getDefaultIconIfPossible(bal.token.symbol);

            return {
              id: idx,
              name: bal.token && bal.token.symbol,
              icon: tokenIcon ? tokenIcon : bal.token.logoUri,
              balance,
              usd: bal.token
                ? balance * prices[bal.token.symbol]
                : balance * prices["ETH"],
            };
          }
          // eth
          else if (bal.balance) {
            seenTokens[DEFAULT_TOKENS.ETH] = true;
            return {
              id: idx,
              name: "ETH",
              icon: ETHIcon,
              balance: bal.balance / 10 ** 18,
              usd: bal.balanceUsd,
            };
          } else return "";
        })
        .filter(Boolean);

      if (allTokenDetails.length < 3) {
        const zeroBalanceTokensToShow = defaultTokenDetails.filter(
          (token) => !seenTokens[token.name]
        );
        setTokenDetails([...allTokenDetails, ...zeroBalanceTokensToShow]);
      } else {
        setTokenDetails(allTokenDetails.slice(0, 3));
      }
    }
  }, [balances, prices]);

  const onSubmit = async (values) => {
    const payoutDetails = [
      {
        address: values.address,
        salaryAmount: values.amount,
        salaryToken: values.currency,
        description: values.description || "",
      },
    ];
    setPayoutDetails(payoutDetails);
    await massPayout(payoutDetails);
  };

  const goBack = () => {
    history.goBack();
  };

  const renderTransferDetails = () => (
    <Card className="quick-transfer">
      <Title className="mb-4">Quick Fund Transfer</Title>
      <Heading>PAYING FROM</Heading>
      <ShowToken>
        {loading && <Loading color="#7367f0" />}

        {!loading && selectedTokenDetails && (
          <React.Fragment>
            <div>
              <Img
                src={selectedTokenDetails.icon}
                alt="token icon"
                width="36"
              />
            </div>
            <div className="token-balance">
              <div className="value">{selectedTokenDetails.balance}</div>
              <div className="name">{selectedTokenDetails.name}</div>
            </div>
            <div className="change">Change</div>
          </React.Fragment>
        )}
      </ShowToken>

      <Heading>PAYING TO</Heading>
      <Row className="mb-3">
        <Col lg="12">
          <Input
            type="text"
            name="address"
            register={register}
            required={`Wallet Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Wallet Address"
          />
          <ErrorMessage name="address" errors={errors} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg="6" sm="12">
          <Input
            type="number"
            name="amount"
            register={register}
            required={`Amount is required`}
            placeholder="Amount"
          />
          <ErrorMessage name="amount" errors={errors} />
        </Col>
        <Col lg="6" sm="12">
          <Select
            name="currency"
            register={register}
            required={`Token is required`}
            options={[
              { name: "DAI", value: "DAI" },
              { name: "USDC", value: "USDC" },
            ]}
          />
          <ErrorMessage name="currency" errors={errors} />
        </Col>
      </Row>

      <Heading>DESCRIPTION (Optional)</Heading>
      <Row className="mb-3">
        <Col lg="12">
          <TextArea
            name="description"
            register={register}
            placeholder="Paid 500 DAI to John Doe..."
            rows="5"
            cols="50"
          />
        </Col>
      </Row>

      <Button
        large
        type="submit"
        style={{ marginTop: "50px" }}
        disabled={!formState.isValid || loadingTx}
        loading={loadingTx}
      >
        Send
      </Button>
    </Card>
  );

  const renderQuickTransfer = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepsCard>{renderTransferDetails()}</StepsCard>
      </form>
    );
  };

  return !submittedTx ? (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <Info>
        <div
          style={{
            maxWidth: "1200px",
            transition: "all 0.25s linear",
          }}
          className="mx-auto"
        >
          <Button iconOnly className="p-0" onClick={goBack}>
            <ActionItem>
              <Circle>
                <FontAwesomeIcon icon={faLongArrowAltLeft} color="#fff" />
              </Circle>
              <div className="mx-3">
                <div className="name">Back</div>
              </div>
            </ActionItem>
          </Button>
        </div>
      </Info>

      <Container
        style={{
          maxWidth: "1200px",
          transition: "all 0.25s linear",
        }}
      >
        {renderQuickTransfer()}
      </Container>
    </div>
  ) : (
    <TransactionSubmitted txHash={txHash} selectedCount={1} />
  );
}