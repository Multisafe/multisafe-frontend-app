import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";

import Button from "components/common/Button";
import {
  Input,
  TextArea,
  CurrencyInput,
  SelectToken,
} from "components/common/Form";
import { useMassPayout, useActiveWeb3React, useEncryptionKey } from "hooks";
import {
  makeSelectError as makeSelectErrorInCreateTx,
  makeSelectLoading as makeSelectSingleOwnerAddTxLoading,
} from "store/transactions/selectors";
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
  makeSelectPrices,
} from "store/tokens/selectors";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import DeleteSvg from "assets/icons/delete-bin.svg";
import Img from "components/common/Img";
import ErrorText from "components/common/ErrorText";

// import { Error } from "components/common/Form/styles";
import { QuickTransferContainer } from "./styles";

const defaultValues = {
  batch: [
    {
      receivers: [{ address: "" }],
    },
  ],
};

function NestedReceivers({
  nestIndex,
  control,
  register,
  watch,
  existingTokenDetails,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `batch[${nestIndex}].receivers`,
  });

  const selectedToken = watch(`batch[${nestIndex}].token`);

  const [selectedTokenDetails, setSelectedTokenDetails] = useState();

  // Selectors
  const prices = useSelector(makeSelectPrices());

  useEffect(() => {
    if (selectedToken && selectedToken.value && existingTokenDetails) {
      setSelectedTokenDetails(
        existingTokenDetails.filter(
          ({ name }) => name === selectedToken.value
        )[0]
      );
    }
  }, [selectedToken, existingTokenDetails]);

  // useEffect(() => {
  //   if (watchedReceivers && selectedTokenDetails) {
  //     const totalAmountInToken = watchedReceivers.reduce(
  //       (total, { amount }) => {
  //         return amount ? total + Number(amount) : total;
  //       },
  //       0
  //     );

  //     if (totalAmountInToken > selectedTokenDetails.balance) {
  //       setInsufficientBalanceError(true);
  //     } else {
  //       setInsufficientBalanceError(false);
  //     }
  //   }
  // }, [watchedReceivers, selectedTokenDetails]);

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} className="mb-4">
            <div className="details-row">
              <Input
                type="text"
                name={`batch[${nestIndex}].receivers[${k}].address`}
                register={register}
                required={`Wallet Address is required`}
                pattern={{
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum Address",
                }}
                placeholder="Wallet Address"
                style={{ maxWidth: "32rem" }}
                defaultValue={item.address || ""}
              />

              {selectedToken && selectedToken.value && (
                <div>
                  <Controller
                    control={control}
                    name={`batch[${nestIndex}].receivers[${k}].amount`}
                    rules={{
                      required: "Amount is required",
                      validate: (value) => {
                        if (value <= 0) return "Please check your input";

                        return true;
                      },
                    }}
                    defaultValue={item.amount || ""}
                    render={({ onChange, value }) => (
                      <CurrencyInput
                        type="number"
                        name={`batch[${nestIndex}].receivers[${k}].amount`}
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
                </div>
              )}

              <div style={{ minWidth: "2rem" }}>
                {fields.length > 1 && k === fields.length - 1 && (
                  <Button
                    type="button"
                    iconOnly
                    onClick={() => remove(k)}
                    className="p-0"
                  >
                    <Img src={DeleteSvg} alt="remove" width="16" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="my-4">
        <Button
          type="button"
          onClick={() => append({})}
          className="secondary"
          width="16rem"
          style={{ fontSize: "1.2rem" }}
        >
          <span className="mr-2">+</span>
          Add
        </Button>
      </div>

      <div className="divider" />
    </div>
  );
}

function TokenBatches({
  control,
  register,
  watch,
  tokensDropdown,
  loadingTokens,
  existingTokenDetails,
  setValue,
  getValues,
}) {
  const { fields, remove } = useFieldArray({
    control,
    name: "batch",
  });

  return (
    <>
      <div>
        {fields.map((item, index) => {
          return (
            <div key={item.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="title">Paying From</div>
                  <div className="mb-3">
                    <SelectToken
                      name={`batch[${index}].token`}
                      control={control}
                      required={`Token is required`}
                      width="20rem"
                      options={tokensDropdown}
                      isSearchable
                      placeholder={`Select Currency...`}
                      defaultValue={item.token}
                      isLoading={loadingTokens}
                    />
                  </div>
                </div>
                <Button type="button" onClick={() => remove(index)}>
                  Delete
                </Button>
              </div>

              <div className="title mt-5">Paying To</div>
              <NestedReceivers
                nestIndex={index}
                {...{ control, register, watch, existingTokenDetails }}
              />
            </div>
          );
        })}
      </div>

      <section>
        <Button
          type="button"
          onClick={() => {
            setValue("batch", [
              ...getValues().batch,
              {
                token: undefined,
                receivers: [{ address: "", amount: "" }],
              },
            ]);
          }}
        >
          Add Batch
        </Button>
      </section>
    </>
  );
}

export default function FlexibleQuickTransfer(props) {
  const [encryptionKey] = useEncryptionKey();

  const { handleHide } = props;
  const { account } = useActiveWeb3React();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  // const [insufficientBalanceError, setInsufficientBalanceError] =
  //   useState(false);

  const { loadingTx, multiTokenMassPayout } = useMassPayout();

  const {
    register,
    errors,
    handleSubmit,
    formState,
    control,
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const dispatch = useDispatch();

  // Selectors
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const tokenList = useSelector(makeSelectTokenList());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getTokens(safeAddress));
    }
  }, [safeAddress, dispatch]);

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
                {formatNumber(details.balance, 5)} {details.name}
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

    // const receivers = values.receivers.map(({ address, amount }) => ({
    //   address,
    //   salaryAmount: amount,
    //   salaryToken: selectedTokenDetails.name,
    //   description: values.description || "",
    //   usd: selectedTokenDetails.usdConversionRate * amount,
    // }));

    // const totalAmountToPay = receivers.reduce(
    //   (total, { usd }) => (total += usd),
    //   0
    // );

    const addresses = [];

    for (let { receivers } of values.batch) {
      for (let { address } of receivers) {
        addresses.push(address);
      }
    }

    console.log({ addresses });

    const to = cryptoUtils.encryptDataUsingEncryptionKey(
      JSON.stringify([]),
      encryptionKey,
      organisationType
    );
    const baseRequestBody = {
      to,
      safeAddress: safeAddress,
      createdBy: account,
      tokenValue: 0,
      tokenCurrency: "USDT",
      fiatValue: "100",
      fiatCurrency: "USD",
      addresses,
      transactionMode: TRANSACTION_MODES.FLEXIBLE_MASS_PAYOUT,
    };

    await multiTokenMassPayout({
      batch: values.batch,
      allTokenDetails: existingTokenDetails,
      baseRequestBody,
    });
  };

  const renderFlexibleQuickTransfer = () => (
    <div>
      <TokenBatches
        {...{
          control,
          register,
          watch,
          getValues,
          setValue,
          errors,
          tokensDropdown,
          loadingTokens,
          existingTokenDetails,
        }}
      />

      <div className="title mt-5">Description (Optional)</div>
      <div>
        <TextArea
          name="description"
          register={register}
          placeholder="Paid 500 DAI to John Doe..."
          rows="3"
          cols="50"
          defaultValue={defaultValues ? defaultValues.description : ""}
        />
      </div>

      <div className="buttons mt-5">
        <Button
          type="button"
          className="secondary-2"
          onClick={handleHide}
          style={{ minWidth: "16rem" }}
        >
          Close
        </Button>
        <Button
          type="submit"
          style={{ minWidth: "16rem" }}
          disabled={
            !formState.isValid ||
            loadingTx ||
            addingMultisigTx ||
            addingSingleOwnerTx ||
            loadingSafeDetails ||
            isReadOnly
          }
          loading={loadingTx || addingMultisigTx || addingSingleOwnerTx}
        >
          {threshold > 1 ? `Create Transaction` : `Send`}
        </Button>
      </div>

      {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
    </div>
  );

  return (
    <QuickTransferContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderFlexibleQuickTransfer()}
      </form>
    </QuickTransferContainer>
  );
}
