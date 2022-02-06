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
import { TextArea } from "components/common/Form";
import Img from "components/common/Img";
import { showWarningToast, toaster } from "components/common/Toast";
import TokenImg from "components/common/TokenImg";
import { LabelsSelect } from "components/LabelsSelect";
import { STREAM_DURATION_OPTIONS } from "constants/index";
import { TRANSACTION_MODES } from "constants/transactions";
import { useActiveWeb3React, useEncryptionKey } from "hooks";
import useMassStream from "hooks/useMassStream";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
  setStreamSummary,
  updateForm,
} from "store/new-stream/actions";
import {
  makeSelectFormData,
  makeSelectStep,
  makeSelectStreamSummary,
} from "store/new-stream/selectors";
import { STEPS } from "store/register/resources";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { getTokenList, getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeSelectTokenList,
  makeSelectTotalBalance,
} from "store/tokens/selectors";
import { makeSelectError as makeSelectErrorInCreateTx } from "store/transactions/selectors";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";
import xss from "xss";
import SelectFromTeamModal from "../SelectFromTeamModal";
import {
  ButtonsContainer,
  FinalSummarySection,
  GrandTotalText,
  Heading,
  HeadingContainer,
  InputTitle,
  NewStreamContainer,
  SectionDivider,
  StreamFooter,
  StreamRow,
  StreamRowContainer,
  SummaryContainer,
} from "../shared/styles/Components";
import { TransferSummaryContainer } from "../styles/NewTransfer";
import {
  PaymentButtonContainer,
  PaymentDescription,
  PaymentFlex,
  PaymentSubtitle,
  PaymentTitle,
} from "../styles/PaymentSummary";
import TokenSummary from "../TokenSummary";
import UploadCsvModal from "../UploadCsvModal";
import StreamBatches from "./StreamBatches";
import StreamRateMessage from "./StreamRateMessage";

const DEFAULT_STREAM_DURATION = STREAM_DURATION_OPTIONS[0];

const defaultValues = {
  batch: [
    {
      receivers: [
        {
          address: "0xa78a6CFDe1c40f9fBdaa1a3DD6ac9AeD0bBe3A84",
          tokenValue: "1",
          duration: DEFAULT_STREAM_DURATION,
        },
        {
          address: "0x4981540F20C9C90d7B68Fc7bFb769BD9068B0042",
          tokenValue: "1",
          duration: DEFAULT_STREAM_DURATION,
        },
      ],
      departmentName: "",
      isDisabled: false,
    },
    {
      receivers: [
        {
          address: "0x2d21388dd08232060C01cEb08eBaFb68D16423fB",
          tokenValue: "1",
          duration: DEFAULT_STREAM_DURATION,
        },
      ],
      departmentName: "",
      isDisabled: false,
    },
  ],
};

const MAX_BATCH_LENGTH = 5;

const getDescription = (receivers, fiatValue) => {
  return `Stream $${formatNumber(fiatValue)} to ${receivers} address${
    receivers > 1 ? "es" : ""
  }`;
};

const StreamModal = ({ prefilledValues }) => {
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

  const [encryptionKey] = useEncryptionKey();

  const { account, chainId } = useActiveWeb3React();
  const [existingTokenDetails, setExistingTokenDetails] = useState();
  const [tokensDropdown, setTokensDropdown] = useState([]);
  const [grandTotalSummary, setGrandTotalSummary] = useState(null);
  const [isInsufficientBalanceError, setIsInsufficientBalanceError] =
    useState(false);
  const [isBatchCountTooHigh, setIsBatchCountTooHigh] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);

  const { loadingTx, batchStream } = useMassStream();

  const batchWatcher = watch("batch");

  const dispatch = useDispatch();

  // selectors
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const loadingTokens = useSelector(makeSelectLoadingTokens());
  const tokenList = useSelector(makeSelectTokenList());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const streamSummary = useSelector(makeSelectStreamSummary());
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const totalBalance = useSelector(makeSelectTotalBalance());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getTokenList(safeAddress, chainId));
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
    if (streamSummary && step === STEPS.ZERO) {
      const hasInsufficientBalance = streamSummary.some(
        (summary) => summary && summary.isInsufficientBalance
      );
      setIsInsufficientBalanceError(hasInsufficientBalance);
    } else if (streamSummary && step === STEPS.ONE) {
      const grandTotalSummary = streamSummary.reduce(
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
  }, [streamSummary, step]);

  useEffect(() => {
    if (batchWatcher && batchWatcher.length >= MAX_BATCH_LENGTH) {
      setIsBatchCountTooHigh(true);
    } else {
      setIsBatchCountTooHigh(false);
    }
  }, [batchWatcher]);
  const showWarning = () => {
    const WARNING_TOAST_ID = "stream-warning-msg";
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

  const resetForm = () => {
    reset(defaultValues);
    dispatch(setStreamSummary([]));
  };

  const handleAddBatch = () => {
    setValue("batch", [
      ...getValues().batch,
      {
        token: undefined,
        receivers: [
          {
            address: "",
            tokenValue: "",
            duration: DEFAULT_STREAM_DURATION,
          },
        ],
      },
    ]);

    goToBottom();
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

      const encryptedStreamSummary = streamSummary.map(
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
        JSON.stringify(streamSummary),
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
        tokenValues,
        tokenCurrencies,
        fiatValue: grandTotalSummary.usdTotal,
        description: encryptedDescription,
        notes: encryptedNote,
        fiatCurrency: "USD",
        addresses,
        labels: selectedLabels.map(({ value }) => value),
        transactionMode: TRANSACTION_MODES.STREAMING,
        metaData: {
          streamSummary: encryptedStreamSummary,
          grandTotalSummary,
        },
      };

      console.log({
        form: formData.batch,
        baseRequestBody,
        existingTokenDetails,
      });

      await batchStream({
        batch: formData.batch,
        allTokenDetails: existingTokenDetails,
        baseRequestBody,
      });
    }
  };

  const renderStreamPayout = () => (
    <div>
      <HeadingContainer>
        <Heading>Streams</Heading>
        <div className="d-flex align-items-center">
          <Button
            onClick={resetForm}
            type="button"
            className="primary"
            width="12rem"
            disabled={!streamSummary.length}
          >
            Reset
          </Button>
        </div>
      </HeadingContainer>
      <StreamBatches
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
            {streamSummary.map((summary, index) => {
              const { id, tokenName, receivers } = summary;
              return (
                <AccordionItem key={id} isOpen={index === 0}>
                  <AccordionHeader>Batch {id + 1}</AccordionHeader>
                  <AccordionBody>
                    <React.Fragment>
                      {receivers.map(
                        (
                          {
                            address,
                            tokenValue,
                            departmentName,
                            name,
                            duration,
                          },
                          idx
                        ) => (
                          <>
                            <StreamRowContainer key={`${address}-${idx}`}>
                              <StreamRow>
                                <div>{name}</div>
                                <div>
                                  <TokenImg token={tokenName} />{" "}
                                  {formatNumber(tokenValue, 5)} {tokenName}{" "}
                                  {duration?.label}
                                </div>
                                <div>{address}</div>
                              </StreamRow>
                              <StreamRateMessage
                                style={{ marginBottom: 0 }}
                                duration={duration?.value}
                                tokenName={tokenName}
                                tokenValue={tokenValue}
                              />
                            </StreamRowContainer>
                          </>
                        )
                      )}
                      <TokenSummary
                        showFiatEquivalent={false}
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
  const renderNewStream = () => {
    switch (step) {
      case STEPS.ZERO:
        return <NewStreamContainer>{renderStreamPayout()}</NewStreamContainer>;

      case STEPS.ONE:
        return renderSummary();

      default:
        return null;
    }
  };
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderNewStream()}
        {step === STEPS.ZERO && (
          <StreamFooter>
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
          </StreamFooter>
        )}
      </form>
      <SelectFromTeamModal />
      <UploadCsvModal />
    </React.Fragment>
  );
};

export default StreamModal;
