import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import {
  Input,
  ErrorMessage,
  CurrencyInput,
  SelectToken,
} from "components/common/Form";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
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
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectPrices,
} from "store/tokens/selectors";
import { SpendingLimitContainer } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";
import { MODAL_NAME as TX_SUBMITTED_MODAL } from "components/Payments/TransactionSubmittedModal";

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
    label: "1 Day",
  },
  {
    id: "reset-weekly",
    value: 10080, // 24 * 60 * 7
    label: "1 Week",
  },
  {
    id: "reset-monthly",
    value: 43200, // 24 * 60 * 30
    label: "1 Month",
  },
];

export default function SpendingLimits(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide } = props;

  const { account } = useActiveWeb3React();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [spendingLimitDetails, setSpendingLimitDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);

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

  const { register, errors, handleSubmit, formState, control, watch } = useForm(
    {
      mode: "onChange",
    }
  );
  const selectedToken = watch("token") && watch("token").value;

  const dispatch = useDispatch();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
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
            fiatValue: totalAllowanceAmount,
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
              fiatValue: totalAllowanceAmount,
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
    organisationType,
  ]);

  useEffect(() => {
    if (selectedToken && existingTokenDetails) {
      setSelectedTokenDetails(
        existingTokenDetails.filter(({ name }) => name === selectedToken)[0]
      );
    }
  }, [selectedToken, existingTokenDetails]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0 && !tokensDropdown.length) {
      setExistingTokenDetails(tokenList);
      setTokensDropdown(
        tokenList.map((details) => ({
          value: details.name,
          label: constructLabel({
            token: details.name,
            component: (
              <div>
                {formatNumber(details.balance)} {details.name}
              </div>
            ),
            imgUrl: details.icon,
          }),
        }))
      );
    }
  }, [tokenList, tokensDropdown]);

  useEffect(() => {
    if (metaTxHash || submittedTx) {
      handleHide();
      dispatch(
        show(TX_SUBMITTED_MODAL, {
          txHash: txHash ? txHash : metaTxHash,
          transactionId: singleOwnerTransactionId,
        })
      );
    }
  }, [
    dispatch,
    metaTxHash,
    singleOwnerTransactionId,
    submittedTx,
    txHash,
    handleHide,
  ]);

  const onSubmit = async (values) => {
    console.log({ values });
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

  const renderSpendingLimitDetails = () => (
    <SpendingLimitContainer>
      <div className="title">Beneficiary</div>
      <div className="mb-3">
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
      </div>

      <div className="title mt-5">Select Asset</div>
      <div className="mb-3">
        <SelectToken
          name="token"
          control={control}
          required={`Token is required`}
          width="20rem"
          options={tokensDropdown}
          isSearchable
          placeholder={`Select Currency...`}
          defaultValue={null}
          isLoading={loadingTokens}
        />
      </div>

      {selectedToken && (
        <div className="mt-4">
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
                placeholder="0.00"
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
        </div>
      )}

      <div className="title mt-5">Reset Time</div>
      <p className="subtitle">
        The allowance will automatically reset after the defined time period.
      </p>

      <div className="options">
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
            labelStyle={{
              marginBottom: 0,
              padding: "0 2.4rem",
              fontSize: "1.4rem",
            }}
          />
        ))}
      </div>

      <div className="d-flex justify-content-center">
        <Button
          type="submit"
          style={{ marginTop: "8rem", minWidth: "16rem" }}
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
      </div>

      {errorFromMetaTx && (
        <div className="text-danger mt-3">{errorFromMetaTx}</div>
      )}
    </SpendingLimitContainer>
  );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderSpendingLimitDetails()}
      </form>
    </div>
  );
}
