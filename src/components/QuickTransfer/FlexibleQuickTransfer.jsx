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

import { Error } from "components/common/Form/styles";
import { QuickTransferContainer } from "./styles";

const defaultValues = {
  test: [
    {
      name: "useFieldArray1",
      nestedArray: [{ field1: "field1", field2: "field2" }],
    },
    {
      name: "useFieldArray2",
      nestedArray: [{ field1: "field1", field2: "field2" }],
    },
  ],
};

function NestedReceivers({ nestIndex, control, register }) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `test[${nestIndex}].nestedArray`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <label>Nested Array:</label>
            <input
              name={`test[${nestIndex}].nestedArray[${k}].field1`}
              ref={register({ required: true })}
              defaultValue={item.field1}
              style={{ marginRight: "25px" }}
            />

            <input
              name={`test[${nestIndex}].nestedArray[${k}].field2`}
              ref={register()}
              defaultValue={item.field2}
            />
            <button type="button" onClick={() => remove(k)}>
              Delete Nested
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            field1: "",
            field2: "",
          })
        }
      >
        Append Nested
      </button>

      <hr />
    </div>
  );
}

function PayoutBatches({ control, register, setValue, getValues }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "batch",
  });

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <input
                name={`batch[${index}].name`}
                ref={register()}
                defaultValue={item.name}
              />

              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
              <NestedReceivers nestIndex={index} {...{ control, register }} />
            </li>
          );
        })}
      </ul>

      <section>
        <button
          type="button"
          onClick={() => {
            append({ name: "append" });
          }}
        >
          append
        </button>

        <button
          type="button"
          onClick={() => {
            setValue("batch", [
              ...getValues().batch,
              {
                name: "append",
                nestedArray: [{ field1: "append", field2: "append" }],
              },
            ]);
          }}
        >
          Append Nested
        </button>

        <button
          type="button"
          onClick={() => {
            setValue("batch", [
              {
                name: "append",
                nestedArray: [{ field1: "Prepend", field2: "Prepend" }],
              },
              ...getValues().batch,
            ]);
          }}
        >
          prepend Nested
        </button>
      </section>
    </>
  );
}

export default function FlexibleQuickTransfer(props) {
  const [encryptionKey] = useEncryptionKey();

  const { handleHide, defaultValues } = props;
  const { account } = useActiveWeb3React();
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [insufficientBalanceError, setInsufficientBalanceError] =
    useState(false);

  const { loadingTx, massPayout } = useMassPayout();

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
    // defaultValues: {
    //   receivers: [{ address: "", amount: "" }],
    // },
  });
  const {
    fields: batches,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({
    control,
    name: "batch",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "receivers",
  });

  const selectedToken = watch("token");
  const receivers = watch("receivers");
  console.log({ selectedToken });

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
  const prices = useSelector(makeSelectPrices());
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
  };

  console.log({ batches, receivers });

  const renderFlexibleQuickTransfer = () => (
    <div>
      <PayoutBatches
        {...{ control, register, defaultValues, getValues, setValue, errors }}
      />
      {/* {batches.map(({ id: batchId }, batchIdx) => {
        console.log({ batchId, batchIdx });
        return (
          <div key={batchId}>
            <div>
              <div className="title">Paying From</div>
              <div className="mb-3">
                <SelectToken
                  name={`token[${batchIdx}]`}
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
            </div>

            <div className="title mt-5">Paying To</div>
            {fields.map(({ id }, index) => (
              <div key={id} className="mb-4">
                <div className="details-row">
                  <Input
                    type="text"
                    name={`receivers[${index + batchIdx}].${batchIdx}.address`}
                    register={register}
                    required={`Wallet Address is required`}
                    pattern={{
                      value: /^0x[a-fA-F0-9]{40}$/,
                      message: "Invalid Ethereum Address",
                    }}
                    placeholder="Wallet Address"
                    style={{ maxWidth: "32rem" }}
                    // defaultValue={
                    //   defaultValues && defaultValues.receivers[index]
                    //     ? defaultValues.receivers[index].address
                    //     : ""
                    // }
                  />

                  {selectedToken &&
                    selectedToken[batchIdx] &&
                    selectedToken[batchIdx].value && (
                      <div>
                        <Controller
                          control={control}
                          name={`receivers[${
                            index + batchIdx
                          }].${batchIdx}.amount`}
                          rules={{
                            required: "Amount is required",
                            validate: (value) => {
                              if (value <= 0) return "Please check your input";

                              return true;
                            },
                          }}
                          // defaultValue={
                          //   defaultValues && defaultValues.receivers[index]
                          //     ? defaultValues.receivers[index].amount
                          //     : ""
                          // }
                          render={({ onChange, value }) => (
                            <CurrencyInput
                              type="number"
                              name={`receivers[${
                                index + batchIdx
                              }].${batchIdx}.amount`}
                              value={value}
                              onChange={onChange}
                              placeholder="0.00"
                              conversionRate={
                                prices &&
                                selectedTokenDetails &&
                                prices[selectedTokenDetails.name]
                              }
                              tokenName={
                                selectedTokenDetails
                                  ? selectedTokenDetails.name
                                  : ""
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
                        onClick={() => remove([index + batchIdx])}
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
          </div>
        );
      })} */}

      {/* <div className="my-4">
        <Button
          type="button"
          onClick={() => appendBatch({})}
          className="secondary"
          width="16rem"
          style={{ fontSize: "1.2rem" }}
        >
          <span className="mr-2">+</span>
          Add Batch
        </Button>
      </div> */}

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
