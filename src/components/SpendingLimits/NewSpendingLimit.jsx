import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import TransactionSubmitted from "components/Payments/TransactionSubmitted";
import { Info } from "components/Dashboard/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import Img from "components/common/Img";
import { Input, ErrorMessage, CurrencyInput } from "components/common/Form";
import { useMassPayout, useLocalStorage, useActiveWeb3React } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import {
  addTransaction,
  clearTransactionHash,
} from "store/transactions/actions";
import {
  makeSelectMetaTransactionHash,
  makeSelectError as makeSelectErrorInCreateTx,
  makeSelectTransactionId as makeSelectSingleOwnerTransactionId,
  makeSelectLoading as makeSelectSingleOwnerAddTxLoading,
} from "store/transactions/selectors";
import metaTxReducer from "store/metatx/reducer";
import metaTxSaga from "store/metatx/saga";
import { getMetaTxEnabled } from "store/metatx/actions";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import safeReducer from "store/safe/reducer";
import safeSaga from "store/safe/saga";
import { getNonce } from "store/safe/actions";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import {
  makeSelectNonce,
  makeSelectLoading as makeSelectLoadingSafeDetails,
} from "store/safe/selectors";
import { createMultisigTransaction } from "store/multisig/actions";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import multisigSaga from "store/multisig/saga";
import multisigReducer from "store/multisig/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import {
  makeSelectOwnerSafeAddress,
  makeSelectIsMultiOwner,
  makeSelectThreshold,
  makeSelectOrganisationType,
} from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading,
  makeSelectTokenList,
  makeSelectPrices,
  // makeSelectError,
} from "store/tokens/selectors";
import Loading from "components/common/Loading";
import { defaultTokenDetails } from "constants/index";
import SelectTokenModal, {
  MODAL_NAME as SELECT_TOKEN_MODAL,
} from "components/Payments/SelectTokenModal";

import {
  Container,
  Title,
  Heading,
  StepsCard,
  ActionItem,
} from "components/People/styles";

import { ShowToken } from "components/QuickTransfer/styles";
import { Circle } from "components/Header/styles";
import { TRANSACTION_MODES } from "constants/transactions";

const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const tokensKey = "tokens";
const metaTxKey = "metatx";

const resetOptions = [
  {
    id: "reset-none",
    value: 0,
    label: "One-time",
  },
  {
    id: "reset-daily",
    value: 1440, // 24 * 60
    label: "1 day",
  },
  {
    id: "reset-weekly",
    value: 10080, // 24 * 60 * 7
    label: "1 week",
  },
  {
    id: "reset-monthly",
    value: 43200, // 24 * 60 * 30
    label: "1 month",
  },
];

export default function SpendingLimits() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { account } = useActiveWeb3React();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [selectedTokenName, setSelectedTokenName] = useState();
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);
  const [spendingLimitDetails, setSpendingLimitDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();

  const { txHash, loadingTx, createSpendingLimit, txData } = useMassPayout({
    tokenDetails: selectedTokenDetails,
  });
  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: safeKey, reducer: safeReducer });
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });
  useInjectReducer({ key: metaTxKey, reducer: metaTxReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: safeKey, saga: safeSaga });
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });

  const { register, errors, handleSubmit, formState, control } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const history = useHistory();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const loading = useSelector(makeSelectLoading());
  const tokenList = useSelector(makeSelectTokenList());
  const txHashFromMetaTx = useSelector(makeSelectMetaTransactionHash());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const nonce = useSelector(makeSelectNonce());
  const threshold = useSelector(makeSelectThreshold());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const prices = useSelector(makeSelectPrices());
  const singleOwnerTransactionId = useSelector(
    makeSelectSingleOwnerTransactionId()
  );
  const organisationType = useSelector(makeSelectOrganisationType());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const icons = useSelector(makeSelectTokenIcons());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getNonce(ownerSafeAddress));
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (ownerSafeAddress && !icons) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch, icons]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      setTokenDetails(tokenList);
      setSelectedTokenName(tokenList[0].name);
    }
  }, [tokenList]);

  useEffect(() => {
    if (selectedTokenName)
      setSelectedTokenDetails(
        tokenDetails.filter(({ name }) => name === selectedTokenName)[0]
      );
  }, [tokenDetails, selectedTokenName]);

  useEffect(() => {
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  const totalAllowanceAmount = useMemo(() => {
    if (spendingLimitDetails && spendingLimitDetails.length > 0) {
      return spendingLimitDetails.reduce((total, { usd }) => (total += usd), 0);
    }

    return 0;
  }, [spendingLimitDetails]);

  useEffect(() => {
    if (txHash) {
      setSubmittedTx(true);
      if (
        encryptionKey &&
        spendingLimitDetails &&
        ownerSafeAddress &&
        totalAllowanceAmount &&
        selectedTokenDetails
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(spendingLimitDetails),
          encryptionKey,
          organisationType
        );
        // const to = selectedTeammates;

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: ownerSafeAddress,
            transactionHash: txHash,
            tokenValue: spendingLimitDetails.reduce(
              (total, { allowanceAmount }) =>
                (total += parseFloat(allowanceAmount)),
              0
            ),
            tokenCurrency: selectedTokenDetails.name,
            fiatValue: parseFloat(totalAllowanceAmount).toFixed(5),
            addresses: spendingLimitDetails.map(({ address }) => address),
            transactionMode: TRANSACTION_MODES.SPENDING_LIMITS, // spending limits
          })
        );
      }
    } else if (txData) {
      if (
        encryptionKey &&
        spendingLimitDetails &&
        ownerSafeAddress &&
        totalAllowanceAmount &&
        selectedTokenDetails
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(spendingLimitDetails),
          encryptionKey,
          organisationType
        );

        if (!isMultiOwner) {
          // threshold = 1 or single owner
          dispatch(
            addTransaction({
              to,
              safeAddress: ownerSafeAddress,
              createdBy: account,
              txData,
              tokenValue: spendingLimitDetails.reduce(
                (total, { allowanceAmount }) =>
                  (total += parseFloat(allowanceAmount)),
                0
              ),
              tokenCurrency: selectedTokenDetails.name,
              fiatValue: parseFloat(totalAllowanceAmount).toFixed(5),
              addresses: spendingLimitDetails.map(({ address }) => address),
              transactionMode: TRANSACTION_MODES.SPENDING_LIMITS, // spending limits
            })
          );
        } else {
          // threshold > 1
          dispatch(
            createMultisigTransaction({
              to,
              safeAddress: ownerSafeAddress,
              createdBy: account,
              txData,
              tokenValue: spendingLimitDetails.reduce(
                (total, { allowanceAmount }) =>
                  (total += parseFloat(allowanceAmount)),
                0
              ),
              tokenCurrency: selectedTokenDetails.name,
              fiatValue: totalAllowanceAmount,
              fiatCurrency: "USD",
              addresses: spendingLimitDetails.map(({ address }) => address),
              transactionMode: TRANSACTION_MODES.SPENDING_LIMITS, // spending limits
              nonce: nonce,
            })
          );
        }
      }
    }
  }, [
    txHash,
    encryptionKey,
    spendingLimitDetails,
    dispatch,
    ownerSafeAddress,
    totalAllowanceAmount,
    selectedTokenDetails,
    txData,
    account,
    isMultiOwner,
    nonce,
    history,
    organisationType,
  ]);

  const onSubmit = async (values) => {
    const spendingLimitDetails = [
      {
        address: values.address,
        allowanceAmount: values.amount,
        resetTimeMin: values.resetTimeMin,
        allowanceToken: selectedTokenDetails.name,
        description: `Created a new spending limit of ${values.amount} ${selectedTokenDetails.name}`,
        usd: selectedTokenDetails.usdConversionRate * values.amount,
      },
    ];
    setSpendingLimitDetails(spendingLimitDetails);
    await createSpendingLimit(
      values.address,
      values.amount,
      values.resetTimeMin,
      isMultiOwner,
      nonce,
      isMetaEnabled
    );
  };

  const goBack = () => {
    history.goBack();
  };

  const showTokenModal = () => {
    dispatch(
      show(SELECT_TOKEN_MODAL, {
        selectedTokenDetails,
        setSelectedTokenDetails,
      })
    );
  };

  const renderTransferDetails = () => (
    <Card className="new-spending-limit">
      <Title className="mb-4">New spending limit</Title>

      <Heading>BENEFICIARY</Heading>
      <Row className="mb-4">
        <Col lg="12">
          <Input
            type="text"
            name="address"
            register={register}
            required={`Beneficiary Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Beneficiary Address"
          />
          <ErrorMessage name="address" errors={errors} />
        </Col>
      </Row>

      <Heading>SELECT AN ASSET</Heading>

      {loading && (
        <ShowToken>
          <Loading color="#7367f0" />
        </ShowToken>
      )}

      {!loading && selectedTokenDetails && (
        <ShowToken onClick={showTokenModal}>
          <div>
            <Img src={selectedTokenDetails.icon} alt="token icon" width="36" />
          </div>
          <div className="token-balance">
            <div className="value">
              {selectedTokenDetails.balance
                ? parseFloat(selectedTokenDetails.balance).toFixed(2)
                : "0.00"}
            </div>
            <div className="name">{selectedTokenDetails.name}</div>
          </div>
          <div className="change">Change</div>
        </ShowToken>
      )}

      <Row className="mb-4">
        <Col lg="12" sm="12">
          <Controller
            control={control}
            name="amount"
            rules={{
              required: "Amount is required",
              validate: (value) => {
                if (value <= 0) return "Please check your input";

                return true;
              },
            }}
            defaultValue=""
            render={({ onChange, value }) => (
              <CurrencyInput
                type="number"
                name="amount"
                value={value}
                onChange={onChange}
                placeholder="Amount"
                conversionRate={
                  prices &&
                  selectedTokenDetails &&
                  prices[selectedTokenDetails.name]
                }
                tokenName={
                  selectedTokenDetails ? selectedTokenDetails.name : ""
                }
              />
            )}
          />
          <ErrorMessage name="amount" errors={errors} />
        </Col>
      </Row>

      <Heading>RESET TIME</Heading>
      <p>
        The allowance will automatically reset after the defined time period.
      </p>

      <div className="d-flex align-items-center">
        {resetOptions.map(({ id, value, label }, index) => (
          <Input
            name={`resetTimeMin`}
            register={register}
            type="radio"
            id={id}
            value={value}
            defaultChecked={index === 0}
            label={label}
            key={id}
            labelStyle={{ marginBottom: 0, padding: "0 0.8em 0 0.5em" }}
          />
        ))}
      </div>

      <Button
        large
        type="submit"
        className="mt-3"
        disabled={
          !formState.isValid ||
          loadingTx ||
          addingMultisigTx ||
          addingSingleOwnerTx ||
          loadingSafeDetails
        }
        loading={loadingTx || addingMultisigTx || addingSingleOwnerTx}
      >
        {threshold > 1 ? `Create Transaction` : `Create`}
      </Button>
      {errorFromMetaTx && (
        <div className="text-danger mt-3">{errorFromMetaTx}</div>
      )}
    </Card>
  );

  const renderNewSpendingLimit = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepsCard>{renderTransferDetails()}</StepsCard>
      </form>
    );
  };

  return !metaTxHash && !submittedTx ? (
    <div className="position-relative">
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
        {renderNewSpendingLimit()}
      </Container>
      <SelectTokenModal />
    </div>
  ) : (
    <TransactionSubmitted
      txHash={txHash ? txHash : metaTxHash}
      transactionId={singleOwnerTransactionId}
    />
  );
}
