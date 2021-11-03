import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";
import { show } from "redux-modal";
import Big from "big.js";
import { isEqual } from "lodash";

import Button from "components/common/Button";
import {
  Input,
  // TextArea,
  CurrencyInput,
  SelectToken,
  ErrorMessage,
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
import SelectFromTeamModal, {
  MODAL_NAME as SELECT_FROM_TEAM_MODAL,
} from "./SelectFromTeamModal";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import DeleteSvg from "assets/icons/delete-bin.svg";
import Img from "components/common/Img";
import ErrorText from "components/common/ErrorText";

import { QuickTransferContainer } from "./styles";
import { PaymentSummary } from "components/Payments/styles";
import { formatText } from "utils/string-utils";
import { useInjectReducer } from "utils/injectReducer";
import newTransferReducer from "store/new-transfer/reducer";
import { setTransferSummary, setStep } from "store/new-transfer/actions";
import {
  makeSelectTransferSummary,
  makeSelectStep,
} from "store/new-transfer/selectors";

const defaultValues = {
  batch: [
    {
      receivers: [{ address: "" }],
    },
  ],
};

const newTransferKey = "newTransfer";

function NestedReceivers({
  nestIndex,
  control,
  register,
  watch,
  existingTokenDetails,
  errors,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `batch[${nestIndex}].receivers`,
  });

  const selectedToken = watch(`batch[${nestIndex}].token`);
  const receivers = watch(`batch[${nestIndex}].receivers`);

  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [peopleFromTeam, setPeopleFromTeam] = useState([]);

  const dispatch = useDispatch();

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

  useEffect(() => {
    // remove the first empty row, if people from team are added
    if (
      peopleFromTeam.length > 0 &&
      receivers.length === 1 &&
      !receivers[0].address &&
      !receivers[0].amount
    ) {
      remove(0);
    }
  }, [receivers, peopleFromTeam, remove]);

  useEffect(() => {
    if (peopleFromTeam.length > 0 && selectedTokenDetails) {
      const peopleToAdd = peopleFromTeam.map((people) => {
        const {
          firstName,
          lastName,
          salaryToken,
          address,
          salaryAmount,
          departmentName,
        } = people;

        const amount =
          salaryToken === "USD"
            ? Big(salaryAmount || "0")
                .div(Big(selectedTokenDetails.usdConversionRate))
                .round(selectedTokenDetails.decimals)
                .toString()
            : salaryAmount;

        return {
          name: formatText(`${firstName} ${lastName}`),
          address,
          amount,
          departmentName,
          isDisabled: true,
        };
      });

      append(peopleToAdd);
      setPeopleFromTeam([]);
    }
  }, [peopleFromTeam, append, selectedTokenDetails]);

  const showSelectFromTeamModal = () => {
    dispatch(
      show(SELECT_FROM_TEAM_MODAL, {
        selectedToken: selectedToken && selectedToken.value,
        setPeopleFromTeam,
      })
    );
  };

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} className="mb-4">
            <div className="details-row">
              <Input
                type="text"
                name={`batch[${nestIndex}].receivers[${k}].name`}
                register={register}
                placeholder="Enter Name (optional)"
                style={{ maxWidth: "18rem" }}
                defaultValue={item.name || ""}
                disabled={item.isDisabled}
              />

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
                style={{ maxWidth: "38rem" }}
                defaultValue={item.address || ""}
                disabled={item.isDisabled}
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
                {fields.length > 1 && (
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
              {item.departmentName && <div>{item.departmentName}</div>}
            </div>
            <div>
              <ErrorMessage
                errors={errors}
                name={`batch[${nestIndex}].receivers[${k}].address.message`}
              />
              <ErrorMessage
                errors={errors}
                name={`batch[${nestIndex}].receivers[${k}].amount.message`}
              />
            </div>
          </div>
        );
      })}

      <div className="my-4 d-flex">
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
        {selectedToken && selectedToken.value && (
          <Button
            type="button"
            onClick={showSelectFromTeamModal}
            className="secondary ml-3"
            width="16rem"
            style={{ fontSize: "1.2rem" }}
          >
            <span className="mr-2">+</span>
            Select from team
          </Button>
        )}
      </div>

      <div className="divider" />
    </div>
  );
}

const TokenSummary = ({ summary }) => {
  // const [totalAmountInToken, setTotalAmountInToken] = useState(0);
  // const [totalAmountInUsd, setTotalAmountInUsd] = useState(0);
  // const [summary, setSummary] = useState();
  // // const [selectedCount, setSelectedCount] = useState(0);

  // // Selectors
  // const prices = useSelector(makeSelectPrices());
  // useEffect(() => {
  //   if (prices && receivers && selectedToken) {
  //     const amountInToken = receivers.reduce((sum, { amount }) => {
  //       if (amount) sum += Number(amount);
  //       return sum;
  //     }, 0);

  //     setTotalAmountInToken(amountInToken);
  //     setTotalAmountInUsd(amountInToken * prices[selectedToken.value]);
  //   }
  // }, [receivers, prices, selectedToken]);

  // const tokenDetails = useMemo(
  //   () =>
  //     existingTokenDetails && selectedToken
  //       ? existingTokenDetails.find(({ name }) => name === selectedToken.value)
  //       : null,
  //   [existingTokenDetails, selectedToken]
  // );

  // useEffect(() => {
  //   if (selectedToken && receivers) {
  //     let prevTokenTotal = 0;
  //     let prevUsdTotal = 0;
  //     for (let i = 0; i < index; i++) {
  //       const { tokenName, tokenTotal, usdTotal } = batchSummary[i];
  //       if (tokenName === selectedToken.value) {
  //         prevTokenTotal += tokenTotal;
  //         prevUsdTotal += usdTotal;
  //       }
  //     }

  //     const summary = {
  //       tokenName: selectedToken.value,
  //       receivers,
  //       count: receivers.length,
  //       tokenTotal: totalAmountInToken,
  //       usdTotal: totalAmountInUsd,
  //       isInsufficientBalance:
  //         tokenDetails.balance - prevUsdTotal - totalAmountInToken < 0,
  //       currentTokenBalance: tokenDetails.balance - prevTokenTotal,
  //       currentUsdBalance: tokenDetails.balance - prevUsdTotal,
  //       tokenBalanceAfterPayment:
  //         tokenDetails.balance - prevUsdTotal - totalAmountInToken,
  //       usdBalanceAfterPayment:
  //         tokenDetails.balance - prevUsdTotal - totalAmountInUsd,
  //     };

  //     if (!batchSummary[index]) {
  //       batchSummary.push(summary);
  //     } else {
  //       batchSummary[index] = summary;
  //     }
  //     if (batchSummary.length > batchLength) {
  //       // if batch is deleted, remove last entry
  //       batchSummary.pop();
  //     }
  //     console.log({ batchSummary, index });
  //     setBatchSummary(batchSummary);
  //     setSummary({ ...batchSummary[index] });
  //   }
  // }, [
  //   totalAmountInToken,
  //   totalAmountInUsd,
  //   index,
  //   batchSummary,
  //   setBatchSummary,
  //   selectedToken,
  //   receivers,
  //   batchLength,
  //   tokenDetails,
  // ]);

  if (!summary) return null;

  const {
    tokenName,
    // receivers,
    count,
    tokenTotal,
    usdTotal,
    isInsufficientBalance,
    currentTokenBalance,
    currentUsdBalance,
    tokenBalanceAfterPayment,
    usdBalanceAfterPayment,
  } = summary;

  return (
    <PaymentSummary>
      <div className="payment-info">
        <div>
          <div className="payment-title">Current Balance</div>
          <div className="payment-subtitle text-bold">
            {`${formatNumber(currentTokenBalance, 5)} ${tokenName}`}
          </div>
          <div className="payment-subtitle">
            {`US$ ${formatNumber(currentUsdBalance)}`}
          </div>
        </div>
        <div>
          <div className="payment-title">Balance after payment</div>
          <div className="payment-subtitle text-bold">
            {!isInsufficientBalance ? (
              `${formatNumber(tokenBalanceAfterPayment)} ${tokenName}`
            ) : (
              <ErrorText hideError>Insufficient Balance</ErrorText>
            )}
          </div>
          <div className="payment-subtitle">
            {!isInsufficientBalance
              ? `US$ ${formatNumber(usdBalanceAfterPayment)}`
              : ``}
          </div>
        </div>
        <div>
          <div className="payment-title">Total Selected</div>
          <div className="payment-subtitle">{count} people</div>
        </div>
        <div>
          <div className="payment-title">Total Amount</div>
          <div className="payment-subtitle text-bold">
            {!isNaN(tokenTotal)
              ? `${formatNumber(tokenTotal)} ${tokenName}`
              : `0`}
          </div>
          <div className="payment-subtitle">
            {!isNaN(usdTotal) ? `US$ ${formatNumber(usdTotal)}` : `0`}
          </div>
        </div>
      </div>
    </PaymentSummary>
  );
};

function Batch({
  control,
  register,
  watch,
  tokensDropdown,
  loadingTokens,
  existingTokenDetails,
  errors,
  index,
  batchLength,
  item,
  fields,
  remove,
  receivers,
  selectedToken,
}) {
  const [totalAmountInToken, setTotalAmountInToken] = useState(0);
  const [totalAmountInUsd, setTotalAmountInUsd] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [prevTokenTotal, setPrevTokenTotal] = useState(0);
  const [prevUsdTotal, setPrevUsdTotal] = useState(0);

  const dispatch = useDispatch();

  // Selectors
  const prices = useSelector(makeSelectPrices());
  const transferSummary = useSelector(makeSelectTransferSummary());
  useEffect(() => {
    if (prices && receivers && selectedToken) {
      const amountInToken = receivers.reduce((sum, { amount }) => {
        if (amount) sum += Number(amount);
        return sum;
      }, 0);

      setTotalAmountInToken(amountInToken);
      setTotalAmountInUsd(amountInToken * prices[selectedToken.value]);
      setSelectedCount(receivers.length);
    }
  }, [receivers, prices, selectedToken]);

  const tokenDetails = useMemo(
    () =>
      existingTokenDetails && selectedToken
        ? existingTokenDetails.find(({ name }) => name === selectedToken.value)
        : null,
    [existingTokenDetails, selectedToken]
  );

  useEffect(() => {
    if (selectedToken) {
      let prevTokenTotal = 0;
      let prevUsdTotal = 0;

      for (let i = 0; i < index; i++) {
        if (transferSummary[i]) {
          const { tokenName, tokenTotal, usdTotal } = transferSummary[i];
          if (tokenName === selectedToken.value) {
            prevTokenTotal += tokenTotal;
            prevUsdTotal += usdTotal;
          }
        }
      }

      setPrevTokenTotal(prevTokenTotal);
      setPrevUsdTotal(prevUsdTotal);
    }
  }, [index, transferSummary, selectedToken]);

  useEffect(() => {
    if (selectedToken && tokenDetails && receivers) {
      const summary = {
        tokenName: selectedToken.value,
        receivers,
        count: selectedCount,
        tokenTotal: totalAmountInToken,
        usdTotal: totalAmountInUsd,
        isInsufficientBalance:
          tokenDetails.balance - prevUsdTotal - totalAmountInToken < 0,
        currentTokenBalance: tokenDetails.balance - prevTokenTotal,
        currentUsdBalance: tokenDetails.balance - prevUsdTotal,
        tokenBalanceAfterPayment:
          tokenDetails.balance - prevUsdTotal - totalAmountInToken,
        usdBalanceAfterPayment:
          tokenDetails.balance - prevUsdTotal - totalAmountInUsd,
      };

      if (!transferSummary[index]) {
        dispatch(setTransferSummary([...transferSummary, summary]));
      } else {
        const newTransferSummary = [...transferSummary];
        newTransferSummary[index] = summary;
        if (!isEqual(transferSummary[index], newTransferSummary[index])) {
          console.log("not equal, updating...");
          dispatch(setTransferSummary(newTransferSummary));
        }
      }
    }
  }, [
    dispatch,
    totalAmountInToken,
    totalAmountInUsd,
    index,
    transferSummary,
    prevTokenTotal,
    prevUsdTotal,
    selectedToken,
    receivers,
    selectedCount,
    tokenDetails,
  ]);

  useEffect(() => {
    if (transferSummary.length > batchLength) {
      // if batch is deleted, remove last entry
      dispatch(setTransferSummary(transferSummary.slice(0, -1)));
    }
  }, [transferSummary, batchLength, dispatch]);

  return (
    <div>
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
              defaultValue={item.token || null}
              isLoading={loadingTokens}
            />
          </div>
        </div>
        {fields.length > 1 && (
          <Button type="button" onClick={() => remove(index)}>
            Delete
          </Button>
        )}
      </div>

      <div className="title mt-5">Paying To</div>
      <NestedReceivers
        nestIndex={index}
        {...{ control, register, watch, existingTokenDetails, errors }}
      />
      <div className="mb-5">
        <TokenSummary summary={transferSummary[index]} />
      </div>
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
  errors,
}) {
  const { fields, remove } = useFieldArray({
    control,
    name: "batch",
  });

  // [{ tokenName: "DAI", tokenTotal: "1000", usdTotal: "1000"}]
  const [batchSummary, setBatchSummary] = useState([]);

  return (
    <>
      <div>
        {fields.map((item, index) => {
          const selectedToken = watch(`batch[${index}].token`);
          const receivers = watch(`batch[${index}].receivers`);
          return (
            <Batch
              key={item.id}
              {...{
                control,
                register,
                watch,
                tokensDropdown,
                loadingTokens,
                existingTokenDetails,
                errors,
                index,
                batchLength: fields.length,
                item,
                fields,
                remove,
                batchSummary,
                setBatchSummary,
                receivers,
                selectedToken,
              }}
            />
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

export default function NewTransfer(props) {
  const [encryptionKey] = useEncryptionKey();

  const { handleHide } = props;
  const { account } = useActiveWeb3React();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);

  const { loadingTx, batchMassPayout } = useMassPayout();

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

  useInjectReducer({ key: newTransferKey, reducer: newTransferReducer });

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

    // const receivers = values.receivers.map(({ address, amount, name }) => ({
    //   address,
    //   salaryAmount: amount,
    //   salaryToken: selectedTokenDetails.name,
    //   description: values.description || "",
    //   usd: selectedTokenDetails.usdConversionRate * amount,
    //  name,
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
      tokenCurrency: "USDT", // TODO: Fix
      fiatValue: "100",
      fiatCurrency: "USD",
      addresses,
      transactionMode: TRANSACTION_MODES.FLEXIBLE_MASS_PAYOUT,
    };

    await batchMassPayout({
      batch: values.batch,
      allTokenDetails: existingTokenDetails,
      baseRequestBody,
    });
  };

  const renderFlexibleMassPayout = () => (
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
      {/* 
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
      </div> */}

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
        {renderFlexibleMassPayout()}
      </form>
      <SelectFromTeamModal />
    </QuickTransferContainer>
  );
}
