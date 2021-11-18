import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";
import { isEqual } from "lodash";
import { show } from "redux-modal";

import Button from "components/common/Button";
import { useMassPayout, useActiveWeb3React, useEncryptionKey } from "hooks";
import { makeSelectError as makeSelectErrorInCreateTx } from "store/transactions/selectors";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import {
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
  makeSelectIsMultiOwner,
} from "store/global/selectors";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectTotalBalance,
} from "store/tokens/selectors";
import SelectFromTeamModal from "./SelectFromTeamModal";
import { TRANSACTION_MODES } from "constants/transactions";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import ErrorText from "components/common/ErrorText";
import TokenBatches from "./TokenBatches";
import {
  makeSelectTransferSummary,
  makeSelectStep,
  makeSelectFormData,
} from "store/new-transfer/selectors";
import { STEPS } from "store/register/resources";
import { selectStep, updateForm } from "store/new-transfer/actions";
import {
  Accordion,
  AccordionItem,
  AccordionBody,
  AccordionHeader,
} from "components/common/Accordion";
import { TextArea } from "components/common/Form";
import TokenSummary from "./TokenSummary";
import TokenImg from "components/common/TokenImg";
import Img from "components/common/Img";
import LeftArrowIcon from "assets/icons/new-transfer/left-arrow-secondary.svg";
import UploadCsvModal, {
  MODAL_NAME as UPLOAD_CSV_MODAL,
} from "./UploadCsvModal";
import { Alert, AlertMessage } from "components/common/Alert";
import {
  NewTransferContainer,
  SummaryContainer,
  TransferFooter,
  ButtonsContainer,
  HeadingContainer,
  Heading,
  TransferSummaryContainer,
  TransferRow,
  InputTitle,
  GrandTotalText,
  FixedPortion,
  SectionDivider,
} from "./styles/NewTransfer";
import {
  PaymentFlex,
  PaymentTitle,
  PaymentSubtitle,
  PaymentButtonContainer,
} from "./styles/PaymentSummary";

const defaultValues = {
  batch: [
    {
      receivers: [{ address: "" }],
      departmentName: "",
      isDisabled: false,
    },
  ],
};

const MAX_BATCH_LENGTH = 10;

export default function NewTransfer() {
  const [encryptionKey] = useEncryptionKey();

  const { account } = useActiveWeb3React();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [grandTotalSummary, setGrandTotalSummary] = useState(null);
  const [isInsufficientBalanceError, setIsInsufficientBalanceError] =
    useState(false);
  const [isBatchCountTooHigh, setIsBatchCountTooHigh] = useState(false);

  const { loadingTx, batchMassPayout } = useMassPayout();

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: "onSubmit",
    defaultValues: defaultValues,
  });

  const batchWatcher = watch("batch");

  const dispatch = useDispatch();

  // Selectors
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const tokenList = useSelector(makeSelectTokenList());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const transferSummary = useSelector(makeSelectTransferSummary());
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const totalBalance = useSelector(makeSelectTotalBalance());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

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

  useEffect(() => {
    if (!isEqual(formData, {})) {
      reset({ ...formData });
    }
  }, [reset, formData]);

  useEffect(() => {
    if (transferSummary && step === STEPS.ZERO) {
      if (
        transferSummary.some(
          (summary) => summary && summary.isInsufficientBalance
        )
      ) {
        setIsInsufficientBalanceError(true);
      } else {
        setIsInsufficientBalanceError(false);
      }
    } else if (transferSummary && step === STEPS.ONE) {
      const grandTotalSummary = transferSummary.reduce(
        (totalSummary, { count, usdTotal, tokenName }) => {
          totalSummary.usdTotal += usdTotal;
          totalSummary.count += count;

          if (!totalSummary.tokensMap[tokenName]) {
            totalSummary.tokensMap[tokenName] = tokenName;
            totalSummary.tokens.push(tokenName);
          }

          return totalSummary;
        },
        { count: 0, usdTotal: 0, tokensMap: {}, tokens: [] }
      );

      setGrandTotalSummary(grandTotalSummary);
    }
  }, [transferSummary, step]);

  useEffect(() => {
    if (batchWatcher && batchWatcher.length >= MAX_BATCH_LENGTH) {
      setIsBatchCountTooHigh(true);
    } else {
      setIsBatchCountTooHigh(false);
    }
  }, [batchWatcher]);

  const goBack = () => {
    dispatch(selectStep(step - 1));
  };

  const goNext = () => {
    dispatch(selectStep(step + 1));
  };

  const showUploadCsvModal = () => {
    dispatch(show(UPLOAD_CSV_MODAL));
  };

  const onSubmit = async (values) => {
    dispatch(updateForm(values));

    if (step === STEPS.ZERO) {
      goNext();
    } else {
      const batch = formData.batch;
      const tokenValues = [];
      const tokenCurrencies = [];
      const addresses = [];

      batch.forEach(({ receivers, token }) => {
        const totalTokenValue = receivers.reduce(
          (sum, { tokenValue }) => (sum += Number(tokenValue)),
          0
        );

        for (let { address } of receivers) {
          addresses.push(address);
        }

        tokenValues.push(totalTokenValue);
        tokenCurrencies.push(token.value);
      });

      const encryptedTransferSummary = transferSummary.map(
        ({
          id,
          batchName,
          receivers,
          count,
          tokenName,
          tokenTotal,
          usdTotal,
        }) => {
          return {
            id,
            batchName: id, // TODO: change to batch name
            count,
            tokenName,
            tokenTotal,
            usdTotal,
            receivers: cryptoUtils.encryptDataUsingEncryptionKey(
              JSON.stringify(receivers),
              encryptionKey,
              organisationType
            ),
          };
        }
      );

      const to = cryptoUtils.encryptDataUsingEncryptionKey(
        JSON.stringify(transferSummary),
        encryptionKey,
        organisationType
      );

      const encryptedDescription = values.description
        ? cryptoUtils.encryptDataUsingEncryptionKey(
            values.description,
            encryptionKey,
            organisationType
          )
        : "";

      const baseRequestBody = {
        to,
        safeAddress: safeAddress,
        createdBy: account,
        tokenValue: 0,
        tokenCurrency: "",
        tokenValues,
        tokenCurrencies,
        fiatValue: grandTotalSummary.usdTotal,
        description: encryptedDescription,
        fiatCurrency: "USD",
        addresses,
        transactionMode: TRANSACTION_MODES.FLEXIBLE_MASS_PAYOUT,
        metaData: {
          transferSummary: encryptedTransferSummary,
          grandTotalSummary,
        },
      };

      await batchMassPayout({
        batch: formData.batch,
        allTokenDetails: existingTokenDetails,
        baseRequestBody,
      });
    }
  };

  const renderFlexibleMassPayout = () => (
    <div>
      <HeadingContainer>
        <Heading>New Transfer</Heading>

        <div>
          <Button
            onClick={showUploadCsvModal}
            type="button"
            className="secondary-4"
            width="12rem"
          >
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
          setValue,
        }}
      />

      {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
    </div>
  );

  const renderSummary = () => {
    if (!grandTotalSummary) return null;

    return (
      <SummaryContainer>
        <TransferSummaryContainer>
          <HeadingContainer>
            <Heading>Summary</Heading>
          </HeadingContainer>

          <Accordion>
            {transferSummary.map((summary, index) => {
              const { id, tokenName, receivers } = summary;

              return (
                <AccordionItem key={id} isOpen={index === 0}>
                  <AccordionHeader>Batch {id + 1}</AccordionHeader>
                  <AccordionBody>
                    <React.Fragment>
                      {receivers.map(
                        (
                          { address, tokenValue, departmentName, name },
                          idx
                        ) => (
                          <TransferRow key={`${address}-${idx}`}>
                            <div>{name}</div>
                            <div>
                              <TokenImg token={tokenName} />{" "}
                              {formatNumber(tokenValue, 5)} {tokenName}
                            </div>
                            <div>{address}</div>
                          </TransferRow>
                        )
                      )}
                      <TokenSummary
                        summary={summary}
                        style={{ padding: "2.6rem 3rem", marginTop: "0" }}
                      />
                    </React.Fragment>
                  </AccordionBody>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TransferSummaryContainer>

        <div className="position-relative">
          <SectionDivider />
          <FixedPortion>
            <InputTitle>Description</InputTitle>
            <div>
              <TextArea
                name="description"
                register={register}
                placeholder="Enter Description (Optional)"
                rows="1"
                cols="50"
              />
            </div>

            <InputTitle style={{ marginTop: "3rem" }}>Label</InputTitle>
            <div>
              <TextArea
                name="label"
                register={register}
                placeholder="Enter label"
                rows="1"
                cols="50"
              />
            </div>

            <GrandTotalText>Grand Total</GrandTotalText>

            <PaymentTitle>Total Balance</PaymentTitle>
            <PaymentSubtitle className="text-bold">
              US$ {formatNumber(totalBalance, 2)}
            </PaymentSubtitle>

            <PaymentTitle style={{ marginTop: "2rem" }}>
              Balance after payment
            </PaymentTitle>
            <PaymentSubtitle className="text-bold">
              US$ {formatNumber(totalBalance - grandTotalSummary.usdTotal, 2)}
            </PaymentSubtitle>

            <PaymentTitle style={{ marginTop: "2rem" }}>
              Total amount
            </PaymentTitle>
            <PaymentSubtitle className="text-bold">
              US$ {formatNumber(grandTotalSummary.usdTotal, 2)}
            </PaymentSubtitle>

            <PaymentFlex>
              <div>
                <PaymentTitle style={{ marginTop: "2rem" }}>
                  Total People
                </PaymentTitle>
                <PaymentSubtitle className="text-bold">
                  {grandTotalSummary.count}
                </PaymentSubtitle>
              </div>

              <div>
                <PaymentTitle style={{ marginTop: "2rem" }}>
                  Tokens used
                </PaymentTitle>
                <PaymentSubtitle className="text-bold">
                  {grandTotalSummary.tokens.map((tokenName) => (
                    <TokenImg
                      token={tokenName}
                      className="mr-2"
                      key={tokenName}
                    />
                  ))}
                </PaymentSubtitle>
              </div>
            </PaymentFlex>

            {isMultiOwner ? (
              <Alert className="mt-5">
                <AlertMessage>
                  Please execute this transaction using Coinshift as
                  transactions executed from the
                  <a
                    href={"https://gnosis-safe.io/app/#/"}
                    rel="noopenner noreferrer"
                    target="_blank"
                    className="mx-2"
                  >
                    Gnosis App
                  </a>
                  might fail due to incorrect gas estimation
                </AlertMessage>
              </Alert>
            ) : null}

            <PaymentButtonContainer>
              <Button
                type="submit"
                style={{ minWidth: "16rem" }}
                disabled={
                  loadingTx ||
                  addingMultisigTx ||
                  loadingSafeDetails ||
                  isReadOnly
                }
                loading={loadingTx || addingMultisigTx}
              >
                {threshold > 1 ? `Create Transaction` : `Send`}
              </Button>
              <Button className="secondary-5" onClick={goBack}>
                <Img src={LeftArrowIcon} alt="left arrow" />
                <span className="ml-3">Go Back</span>
              </Button>
            </PaymentButtonContainer>
          </FixedPortion>
        </div>
      </SummaryContainer>
    );
  };
  const renderNewTransfer = () => {
    switch (step) {
      case STEPS.ZERO:
        return (
          <NewTransferContainer>
            {renderFlexibleMassPayout()}
          </NewTransferContainer>
        );

      case STEPS.ONE:
        return renderSummary();

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderNewTransfer()}
        {step === STEPS.ZERO && (
          <TransferFooter>
            <ButtonsContainer>
              <Button
                type="button"
                className="secondary"
                style={{ minWidth: "16rem" }}
                disabled={isBatchCountTooHigh}
                onClick={() => {
                  setValue("batch", [
                    ...getValues().batch,
                    {
                      token: undefined,
                      receivers: [{ address: "", tokenValue: "" }],
                    },
                  ]);
                }}
              >
                Add Batch
              </Button>
              <Button
                type="submit"
                style={{ minWidth: "16rem" }}
                disabled={loadingSafeDetails || isInsufficientBalanceError}
              >
                Confirm
              </Button>
            </ButtonsContainer>
          </TransferFooter>
        )}
      </form>
      <SelectFromTeamModal />
      <UploadCsvModal />
    </React.Fragment>
  );
}
