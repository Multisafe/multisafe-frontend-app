import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";

import Button from "components/common/Button";
import {
  Input,
  ErrorMessage,
  CurrencyConversionInput,
  SelectToken,
} from "components/common/Form";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import { useActiveWeb3React, useEncryptionKey, useSpendingLimits } from "hooks";
import {
  makeSelectError as makeSelectErrorInCreateTx,
  makeSelectLoading as makeSelectSingleOwnerAddTxLoading,
} from "store/transactions/selectors";
import { getMetaTxEnabled } from "store/metatx/actions";
import { getNonce } from "store/safe/actions";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import {
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
} from "store/tokens/selectors";
import { SpendingLimitContainer } from "./styles";
import { TRANSACTION_MODES } from "constants/transactions";
import ErrorText from "components/common/ErrorText";

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

export default function SpendingLimits() {
  const [encryptionKey] = useEncryptionKey();

  const { account } = useActiveWeb3React();

  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);

  const { loadingTx, createSpendingLimit } = useSpendingLimits();
  const { account } = useActiveWeb3React();

  const { register, errors, handleSubmit, control, watch, setValue } = useForm({
    mode: "onSubmit",
  });
  const selectedToken = watch("token") && watch("token").value;

  const dispatch = useDispatch();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const tokenList = useSelector(makeSelectTokenList());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const icons = useSelector(makeSelectTokenIcons());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

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

  const onSubmit = async (values) => {
    console.log({ values });
    const spendingLimitDetails = [
      {
        address: values.address,
        allowanceAmount: values.spendingLimit.tokenValue,
        resetTimeMin: values.resetTimeMin,
        allowanceToken: selectedTokenDetails.name,
        description: `Created a new spending limit of ${values.spendingLimit.tokenValue} ${selectedTokenDetails.name}`,
        usd:
          selectedTokenDetails.usdConversionRate *
          values.spendingLimit.fiatValue,
      },
    ];

    const to = cryptoUtils.encryptDataUsingEncryptionKey(
      JSON.stringify(spendingLimitDetails),
      encryptionKey,
      organisationType
    );

    const baseRequestBody = {
      to,
      safeAddress: ownerSafeAddress,
      createdBy: account,
      tokenValue: values.spendingLimit.tokenValue,
      tokenCurrency: selectedTokenDetails.name,
      fiatValue: values.spendingLimit.fiatValue,
      fiatCurrency: "USD",
      addresses: spendingLimitDetails.map(({ address }) => address),
      transactionMode: TRANSACTION_MODES.SPENDING_LIMITS, // spending limits
    };

    await createSpendingLimit({
      delegate: values.address,
      tokenAmount: values.spendingLimit.tokenValue,
      resetTimeMin: values.resetTimeMin,
      tokenDetails: selectedTokenDetails,
      baseRequestBody,
    });
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
        <div>
          <CurrencyConversionInput
            control={control}
            baseName={"spendingLimit"}
            setValue={setValue}
            tokenName={selectedTokenDetails ? selectedTokenDetails.name : ""}
            conversionRate={
              selectedTokenDetails ? selectedTokenDetails.usdConversionRate : 0
            }
          />
        </div>
      )}
      <div>
        <ErrorMessage
          errors={errors}
          name={`spendingLimit.tokenValue.message`}
        />
        {/* <ErrorMessage
          errors={errors}
          name={`spendingLimit.fiatValue.message`}
        /> */}
      </div>

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
            loadingTx ||
            addingMultisigTx ||
            addingSingleOwnerTx ||
            loadingSafeDetails ||
            isReadOnly
          }
          loading={loadingTx || addingMultisigTx || addingSingleOwnerTx}
        >
          {threshold > 1 ? `Create Transaction` : `Create`}
        </Button>
      </div>

      {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
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
