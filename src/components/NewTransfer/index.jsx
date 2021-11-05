import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";

import Button from "components/common/Button";
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
} from "store/tokens/selectors";
import SelectFromTeamModal from "./SelectFromTeamModal";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import ErrorText from "components/common/ErrorText";
import TokenBatches from "./TokenBatches";
import {
  NewTransferContainer,
  TransferFooter,
  ButtonsContainer,
  HeadingContainer,
  Heading,
} from "./styles/NewTransfer";

const defaultValues = {
  batch: [
    {
      receivers: [{ address: "" }],
      departmentName: "",
      isDisabled: false,
    },
  ],
};

export default function NewTransfer() {
  const [encryptionKey] = useEncryptionKey();

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
      <HeadingContainer>
        <Heading>New Transfer</Heading>

        <div>
          <Button type="button" className="secondary-4" width="12rem">
            Upload CSV
          </Button>
        </div>
      </HeadingContainer>

      <TokenBatches
        {...{
          control,
          register,
          watch,
          errors,
          tokensDropdown,
          loadingTokens,
          existingTokenDetails,
          getValues,
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

      <TransferFooter>
        <ButtonsContainer>
          <Button
            type="button"
            className="secondary"
            style={{ minWidth: "16rem" }}
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
        </ButtonsContainer>
      </TransferFooter>

      {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
    </div>
  );

  return (
    <NewTransferContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderFlexibleMassPayout()}
      </form>
      <SelectFromTeamModal />
    </NewTransferContainer>
  );
}
