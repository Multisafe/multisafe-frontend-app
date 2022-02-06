import InfoHelpIcon from "assets/icons/new-transfer/info-help.svg";
import InfoIcon from "assets/icons/new-transfer/info-warn.svg";
import LeftArrowIcon from "assets/icons/new-transfer/left-arrow-secondary.svg";
import { cryptoUtils } from "coinshift-sdk";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "components/common/Accordion";
import { Alert, AlertMessage } from "components/common/Alert";
import Button from "components/common/Button";
import ErrorText from "components/common/ErrorText";
import ExternalLink from "components/common/ExternalLink";
import { TextArea } from "components/common/Form";
import Img from "components/common/Img";
import { showWarningToast, toaster } from "components/common/Toast";
import TokenImg from "components/common/TokenImg";
import { LabelsSelect } from "components/LabelsSelect";
import { TRANSACTION_MODES } from "constants/transactions";
import { useActiveWeb3React, useEncryptionKey, useMassPayout } from "hooks";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { show } from "redux-modal";
import {
  makeSelectIsMultiOwner,
  makeSelectIsReadOnly,
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
  makeSelectThreshold,
} from "store/global/selectors";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import {
  selectStep,
  setTransferSummary,
  updateForm,
} from "store/new-transfer/actions";
import {
  makeSelectFormData,
  makeSelectStep,
  makeSelectTransferSummary,
} from "store/new-transfer/selectors";
import { STEPS } from "store/register/resources";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectTotalBalance,
} from "store/tokens/selectors";
import { makeSelectError as makeSelectErrorInCreateTx } from "store/transactions/selectors";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import xss from "xss";
import SelectFromTeamModal from "./SelectFromTeamModal";
import {
  ButtonsContainer,
  FinalSummarySection,
  GrandTotalText,
  Heading,
  HeadingContainer,
  HowItWorks,
  HowItWorksContainer,
  InputTitle,
  NewTransferContainer,
  SectionDivider,
  SummaryContainer,
  TransferFooter,
  TransferRow,
  TransferSummaryContainer,
} from "./styles/NewTransfer";
import {
  PaymentButtonContainer,
  PaymentDescription,
  PaymentFlex,
  PaymentSubtitle,
  PaymentTitle,
} from "./styles/PaymentSummary";
import TokenBatches from "./TokenBatches";
import TokenSummary from "./TokenSummary";
import UploadCsvModal, {
  MODAL_NAME as UPLOAD_CSV_MODAL,
} from "./UploadCsvModal";

const defaultValues = {
  batch: [
    {
      receivers: [{ address: "" }],
      departmentName: "",
      isDisabled: false,
    },
  ],
};

const MAX_BATCH_LENGTH = 5;

const getDescription = (receivers, fiatValue) => {
  return `Transfer $${formatNumber(fiatValue)} to ${receivers} address${
    receivers > 1 ? "es" : ""
  }`;
};

export default function NewTransfer({ prefilledValues }) {
  const [encryptionKey] = useEncryptionKey();

  const { account, chainId } = useActiveWeb3React();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [grandTotalSummary, setGrandTotalSummary] = useState(null);
  const [isInsufficientBalanceError, setIsInsufficientBalanceError] =
    useState(false);
  const [isBatchCountTooHigh, setIsBatchCountTooHigh] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);

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
    defaultValues: prefilledValues ? prefilledValues : defaultValues,
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
      dispatch(getTokens(safeAddress, chainId));
    }
  }, [safeAddress, dispatch, chainId]);

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
            address: details.address,
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

  const showWarning = () => {
    const WARNING_TOAST_ID = "warning-msg";
    toaster.dismiss();
    showWarningToast(
      <div className="d-flex align-items-center">
        <Img src={InfoIcon} alt="info warn" className="mr-3" />
        <div>
          Some required information is incorrect. Please check your input.
        </div>
      </div>,
      {
        toastId: WARNING_TOAST_ID,
      }
    );
  };

  useEffect(() => {
    if (
      errors &&
      errors.batch &&
      errors.batch.length > 0 &&
      step === STEPS.ZERO
    ) {
      showWarning();
    } else {
      toaster.dismiss();
    }
  }, [errors, step]);

  const goBack = () => {
    dispatch(selectStep(step - 1));
  };

  const goNext = () => {
    dispatch(selectStep(step + 1));
  };

  const showUploadCsvModal = () => {
    dispatch(show(UPLOAD_CSV_MODAL));
  };

  const onLabelsChange = (value) => {
    setSelectedLabels(value || []);
  };

  const goToBottom = () => {
    // TODO: Use ref instead of DOM
    const container = document.querySelector(".modal.show");
    const scrollHeight = container.scrollHeight;

    container.scrollTo({
      top: scrollHeight,
      left: 0,
    });
  };

  const handleAddBatch = () => {
    setValue("batch", [
      ...getValues().batch,
      {
        token: undefined,
        receivers: [{ address: "", tokenValue: "" }],
      },
    ]);

    goToBottom();
  };

  const resetForm = () => {
    reset(defaultValues);
    dispatch(setTransferSummary([]));
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

      const sanitizedNote = values.note
        ? xss(values.note, {
            stripIgnoreTag: true,
            whiteList: {},
          }).trim()
        : "";
      const encryptedNote = sanitizedNote
        ? cryptoUtils.encryptDataUsingEncryptionKey(
            sanitizedNote,
            encryptionKey,
            organisationType
          )
        : "";

      const to = cryptoUtils.encryptDataUsingEncryptionKey(
        JSON.stringify(transferSummary),
        encryptionKey,
        organisationType
      );

      const description = getDescription(
        addresses.length,
        grandTotalSummary.usdTotal
      );
      const encryptedDescription = cryptoUtils.encryptDataUsingEncryptionKey(
        description,
        encryptionKey,
        organisationType
      );

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
        notes: encryptedNote,
        fiatCurrency: "USD",
        addresses,
        labels: selectedLabels.map(({ value }) => value),
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

        <div className="d-flex align-items-center">
          <ExternalLink href="https://bit.ly/3lw7hZ2">
            <HowItWorksContainer>
              <Img src={InfoHelpIcon} alt="how it works" />
              <HowItWorks className="ml-2">How it works</HowItWorks>
            </HowItWorksContainer>
          </ExternalLink>
          <Button
            onClick={showUploadCsvModal}
            type="button"
            className="secondary-4"
            style={{ marginRight: "2rem" }}
            width="12rem"
          >
            Upload CSV
          </Button>
          <Button
            onClick={resetForm}
            type="button"
            className="primary"
            width="12rem"
            disabled={!transferSummary.length}
          >
            Reset
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

    const allReceivers = formData.batch.reduce(
      (acc, { receivers }) => acc + receivers.length,
      0
    );
    const description = getDescription(
      allReceivers,
      grandTotalSummary.usdTotal
    );

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
          <FinalSummarySection>
            <InputTitle>Description</InputTitle>
            <PaymentDescription>{description}</PaymentDescription>

            <InputTitle style={{ marginTop: "3rem" }}>Label</InputTitle>
            <div>
              <LabelsSelect
                {...{
                  name: "labels",
                  value: selectedLabels,
                  onChange: onLabelsChange,
                }}
              />
            </div>

            <InputTitle style={{ marginTop: "3rem" }}>Note</InputTitle>
            <TextArea
              name="note"
              register={register}
              placeholder="Enter Note"
              rows={1}
            />

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
          </FinalSummarySection>
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
                onClick={handleAddBatch}
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
