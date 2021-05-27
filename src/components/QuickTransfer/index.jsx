import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import {
  Input,
  TextArea,
  CurrencyInput,
  SelectToken,
} from "components/common/Form";
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
import { MODAL_NAME as TX_SUBMITTED_MODAL } from "components/Payments/TransactionSubmittedModal";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import DeleteSvg from "assets/icons/delete-bin.svg";
import { Error } from "components/common/Form/styles";
import { QuickTransferContainer } from "./styles";
import Img from "components/common/Img";
import ErrorText from "components/common/ErrorText";

const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const tokensKey = "tokens";
const metaTxKey = "metatx";

export default function QuickTransfer(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide } = props;
  const { account } = useActiveWeb3React();
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [insufficientBalanceError, setInsufficientBalanceError] =
    useState(false);

  const { txHash, loadingTx, massPayout, txData } = useMassPayout({
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
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // Selectors
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

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getTokens(ownerSafeAddress));
      dispatch(getNonce(ownerSafeAddress));
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (selectedToken && existingTokenDetails) {
      setSelectedTokenDetails(
        existingTokenDetails.filter(({ name }) => name === selectedToken)[0]
      );
    }
  }, [selectedToken, existingTokenDetails]);

  useEffect(() => {
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

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

  const totalAmountToPay = useMemo(() => {
    if (payoutDetails && payoutDetails.length > 0) {
      return payoutDetails.reduce((total, { usd }) => (total += usd), 0);
    }

    return 0;
  }, [payoutDetails]);

  useEffect(() => {
    if (txHash) {
      if (
        encryptionKey &&
        payoutDetails &&
        ownerSafeAddress &&
        totalAmountToPay &&
        selectedTokenDetails
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(payoutDetails),
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
            tokenValue: payoutDetails.reduce(
              (total, { salaryAmount }) => (total += parseFloat(salaryAmount)),
              0
            ),
            tokenCurrency: selectedTokenDetails.name,
            fiatValue: totalAmountToPay,
            addresses: payoutDetails.map(({ address }) => address),
            transactionMode: TRANSACTION_MODES.QUICK_TRANSFER, // quick transfer
          })
        );
      }
    } else if (txData) {
      if (
        encryptionKey &&
        payoutDetails &&
        ownerSafeAddress &&
        totalAmountToPay &&
        selectedTokenDetails
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(payoutDetails),
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
              tokenValue: payoutDetails.reduce(
                (total, { salaryAmount }) =>
                  (total += parseFloat(salaryAmount)),
                0
              ),
              tokenCurrency: selectedTokenDetails.name,
              fiatValue: totalAmountToPay,
              addresses: payoutDetails.map(({ address }) => address),
              transactionMode: TRANSACTION_MODES.QUICK_TRANSFER, // quick transfer
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
              tokenValue: payoutDetails.reduce(
                (total, { salaryAmount }) =>
                  (total += parseFloat(salaryAmount)),
                0
              ),
              tokenCurrency: selectedTokenDetails.name,
              fiatValue: totalAmountToPay,
              fiatCurrency: "USD",
              addresses: payoutDetails.map(({ address }) => address),
              transactionMode: TRANSACTION_MODES.QUICK_TRANSFER, // quick transfer
              nonce: nonce,
            })
          );
        }
      }
    }
  }, [
    txHash,
    encryptionKey,
    payoutDetails,
    dispatch,
    ownerSafeAddress,
    totalAmountToPay,
    selectedTokenDetails,
    txData,
    account,
    isMultiOwner,
    nonce,
    organisationType,
  ]);

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

  const noOfPeoplePaid = useMemo(() => {
    return payoutDetails && payoutDetails.length;
  }, [payoutDetails]);

  useEffect(() => {
    if (metaTxHash && singleOwnerTransactionId) {
      handleHide();
      dispatch(
        show(TX_SUBMITTED_MODAL, {
          txHash: metaTxHash,
          selectedCount: noOfPeoplePaid,
          transactionId: singleOwnerTransactionId,
        })
      );
    }
  }, [
    dispatch,
    metaTxHash,
    singleOwnerTransactionId,
    handleHide,
    noOfPeoplePaid,
  ]);

  const onSubmit = async (values) => {
    const payoutDetails = values.receivers.map(({ address, amount }) => ({
      address,
      salaryAmount: amount,
      salaryToken: selectedTokenDetails.name,
      description: values.description || "",
      usd: selectedTokenDetails.usdConversionRate * amount,
    }));

    setPayoutDetails(payoutDetails);
    await massPayout(
      payoutDetails,
      selectedTokenDetails.name,
      isMultiOwner,
      nonce,
      isMetaEnabled
    );
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
          defaultValue={null}
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
              style={{ maxWidth: "40rem" }}
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
                  defaultValue=""
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
            insufficientBalanceError
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
