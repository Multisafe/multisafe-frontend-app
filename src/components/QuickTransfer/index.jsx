import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";

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

import { Error } from "components/common/Form/styles";
import { QuickTransferContainer } from "./styles";

export default function QuickTransfer(props) {
  const [encryptionKey] = useEncryptionKey();

  const { handleHide, defaultValues } = props;
  const { account } = useActiveWeb3React();
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [insufficientBalanceError, setInsufficientBalanceError] =
    useState(false);

  const { loadingTx, massPayout } = useMassPayout();

  const { register, errors, handleSubmit, formState, control, watch } = useForm(
    {
      mode: "onChange",
      defaultValues: {
        receivers: [{ address: "", amount: "" }],
      },
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "receivers",
  });

  const selectedToken = watch("token") && watch("token").value;
  const watchedRecievers = watch("receivers");

  const dispatch = useDispatch();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  // Selectors
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const tokenList = useSelector(makeSelectTokenList());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const prices = useSelector(makeSelectPrices());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getTokens(safeAddress));
    }
  }, [safeAddress, dispatch]);

  useEffect(() => {
    if (selectedToken && existingTokenDetails) {
      setSelectedTokenDetails(
        existingTokenDetails.filter(({ name }) => name === selectedToken)[0]
      );
    }
  }, [selectedToken, existingTokenDetails]);

  useEffect(() => {
    if (watchedRecievers && selectedTokenDetails) {
      const totalAmountInToken = watchedRecievers.reduce(
        (total, { amount }) => {
          return amount ? total + Number(amount) : total;
        },
        0
      );

      if (totalAmountInToken > selectedTokenDetails.balance) {
        setInsufficientBalanceError(true);
      } else {
        setInsufficientBalanceError(false);
      }
    }
  }, [watchedRecievers, selectedTokenDetails]);

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
    const receivers = values.receivers.map(({ address, amount }) => ({
      address,
      salaryAmount: amount,
      salaryToken: selectedTokenDetails.name,
      description: values.description || "",
      usd: selectedTokenDetails.usdConversionRate * amount,
    }));

    const totalAmountToPay = receivers.reduce(
      (total, { usd }) => (total += usd),
      0
    );

    const to = cryptoUtils.encryptDataUsingEncryptionKey(
      JSON.stringify(receivers),
      encryptionKey,
      organisationType
    );
    const baseRequestBody = {
      to,
      safeAddress: safeAddress,
      createdBy: account,
      tokenValue: receivers.reduce(
        (total, { salaryAmount }) => (total += parseFloat(salaryAmount)),
        0
      ),
      tokenCurrency: selectedTokenDetails.name,
      fiatValue: totalAmountToPay,
      fiatCurrency: "USD",
      addresses: receivers.map(({ address }) => address),
      transactionMode: TRANSACTION_MODES.QUICK_TRANSFER,
    };
    await massPayout({
      receivers,
      tokenDetails: selectedTokenDetails,
      baseRequestBody,
    });
  };

  const renderQuickTransfer = () => (
    <div>
      <div className="title">Paying From</div>
      <div className="mb-3">
        <SelectToken
          name="token"
          control={control}
          required={`Token is required`}
          width="20rem"
          options={tokensDropdown}
          isSearchable
          placeholder={`Select Currency...`}
          defaultValue={defaultValues ? defaultValues.token : null}
          isLoading={loadingTokens}
        />
      </div>

      <div className="title mt-5">Paying To</div>
      {fields.map(({ id }, index) => (
        <div key={id} className="mb-4">
          <div className="details-row">
            <Input
              type="text"
              name={`receivers[${index}].address`}
              register={register}
              required={`Wallet Address is required`}
              pattern={{
                value: /^0x[a-fA-F0-9]{40}$/,
                message: "Invalid Ethereum Address",
              }}
              placeholder="Wallet Address"
              style={{ maxWidth: "32rem" }}
              defaultValue={
                defaultValues && defaultValues.receivers[index]
                  ? defaultValues.receivers[index].address
                  : ""
              }
            />

            {selectedToken && (
              <div>
                <Controller
                  control={control}
                  name={`receivers[${index}].amount`}
                  rules={{
                    required: "Amount is required",
                    validate: (value) => {
                      if (value <= 0) return "Please check your input";

                      return true;
                    },
                  }}
                  defaultValue={
                    defaultValues && defaultValues.receivers[index]
                      ? defaultValues.receivers[index].amount
                      : ""
                  }
                  render={({ onChange, value }) => (
                    <CurrencyInput
                      type="number"
                      name={`receivers[${index}].amount`}
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
              {fields.length > 1 && index === fields.length - 1 && (
                <Button
                  type="button"
                  iconOnly
                  onClick={() => remove(index)}
                  className="p-0"
                >
                  <Img src={DeleteSvg} alt="remove" width="16" />
                </Button>
              )}
            </div>
          </div>
          <div className="error-row">
            {errors["receivers"] &&
              errors["receivers"][index] &&
              errors["receivers"][index].address && (
                <Error>{errors["receivers"][index].address.message}</Error>
              )}
            {errors["receivers"] &&
              errors["receivers"][index] &&
              errors["receivers"][index].amount && (
                <Error>{errors["receivers"][index].amount.message}</Error>
              )}
          </div>
        </div>
      ))}

      <div>
        <Button
          type="button"
          onClick={() => append({})}
          className="secondary"
          width="12rem"
          style={{ fontSize: "1.2rem" }}
        >
          <span className="mr-2">+</span>
          Add More
        </Button>
      </div>

      {insufficientBalanceError && (
        <div className="mt-3">
          <Error>Insufficient Balance</Error>
        </div>
      )}

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
            insufficientBalanceError ||
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
      <form onSubmit={handleSubmit(onSubmit)}>{renderQuickTransfer()}</form>
    </QuickTransferContainer>
  );
}
