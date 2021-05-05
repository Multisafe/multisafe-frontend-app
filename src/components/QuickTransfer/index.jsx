import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import {
  Input,
  ErrorMessage,
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
import ErrorText from "components/common/ErrorText";

import { QuickTransferContainer } from "./styles";

const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const tokensKey = "tokens";
const metaTxKey = "metatx";

export default function QuickTransfer(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide } = props;
  const { account } = useActiveWeb3React();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);

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
    }
  );

  const selectedToken = watch("token") && watch("token").value;

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

  const totalAmountToPay = useMemo(() => {
    if (payoutDetails && payoutDetails.length > 0) {
      return payoutDetails.reduce((total, { usd }) => (total += usd), 0);
    }

    return 0;
  }, [payoutDetails]);

  useEffect(() => {
    if (txHash) {
      setSubmittedTx(true);
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
          selectedCount: 1,
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
    console.log({ selectedTokenDetails });
    const payoutDetails = [
      {
        address: values.address,
        salaryAmount: values.amount,
        salaryToken: selectedTokenDetails.name,
        description: values.description || "",
        usd:
          (selectedTokenDetails.usd / selectedTokenDetails.balance) *
          values.amount,
      },
    ];
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
      <div className="title">Paying To</div>
      <div className="mb-3">
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
      </div>

      <div className="title mt-5">Paying From</div>
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
                else if (
                  selectedTokenDetails &&
                  parseFloat(value) > parseFloat(selectedTokenDetails.balance)
                )
                  return "Insufficient balance";

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

      <div className="d-flex justify-content-center mt-5">
        <Button
          type="button"
          width="16rem"
          className="secondary-2 mr-3"
          onClick={handleHide}
        >
          Close
        </Button>
        <Button
          type="submit"
          style={{ minWidth: "18rem" }}
          disabled={
            !formState.isValid ||
            loadingTx ||
            addingMultisigTx ||
            addingSingleOwnerTx ||
            loadingSafeDetails
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
