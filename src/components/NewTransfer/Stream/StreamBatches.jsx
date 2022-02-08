import DeleteSvg from "assets/icons/delete-bin.svg";
import Button from "components/common/Button";
import { Card } from "components/common/Card";
import { ErrorMessage, SelectToken } from "components/common/Form";
import Img from "components/common/Img";
import { isEqual } from "lodash";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setStreamSummary } from "store/new-stream/actions";
import { makeSelectStreamSummary } from "store/new-stream/selectors";
import { makeSelectPrices } from "store/tokens/selectors";
import {
  BatchContainer,
  BatchName,
  RightRow,
  Title,
} from "../shared/styles/Components";
import TokenSummary from "../TokenSummary";
import NestedStreamReceivers from "./NestedStreamReceivers";
import StreamBatchSummary from "./StreamBatchSummary";

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
  getValues,
  setValue,
}) {
  const [receivers, setReceivers] = useState([]);
  const [prevTokenTotal, setPrevTokenTotal] = useState(0);
  const [prevUsdTotal, setPrevUsdTotal] = useState(0);

  // const {} = useSelector()

  const selectedToken = useWatch({ control, name: `batch[${index}].token` });
  const dispatch = useDispatch();

  const visibleReceivers = useWatch({
    control,
    name: `batch[${index}].receivers`,
    defaultValue: [],
  });
  const selectedCount = visibleReceivers && visibleReceivers.length;

  const prices = useSelector(makeSelectPrices());
  const streamSummary = useSelector(makeSelectStreamSummary());

  const estimatedNettFlowRate = useMemo(() => {
    if (
      visibleReceivers &&
      visibleReceivers.length > 0 &&
      selectedToken &&
      selectedToken.value
    ) {
      const rate = visibleReceivers.reduce(
        (accRate, { tokenValue = 1, duration }) => {
          if (Number(tokenValue) > 0 && duration) {
            const amount = Number(tokenValue) / Number(duration.value);
            accRate += amount;
          }
          return accRate;
        },
        0
      );

      return rate;
    }
    return 0;
  }, [visibleReceivers, selectedToken]);

  const totalAmountInToken = useMemo(() => {
    if (
      visibleReceivers &&
      visibleReceivers.length > 0 &&
      selectedToken &&
      selectedToken.value
    ) {
      const amountInToken = visibleReceivers.reduce((sum, { tokenValue }) => {
        if (tokenValue) sum += Number(tokenValue);
        return sum;
      }, 0);
      return amountInToken;
    }

    return 0;
  }, [visibleReceivers, selectedToken]);

  const totalAmountInUsd = useMemo(() => {
    if (selectedToken && selectedToken.value) {
      return totalAmountInToken * prices[selectedToken.value];
    }

    return 0;
  }, [totalAmountInToken, prices, selectedToken]);

  const tokenDetails = useMemo(
    () =>
      existingTokenDetails && selectedToken
        ? existingTokenDetails.find(({ name }) => name === selectedToken.value)
        : null,
    [existingTokenDetails, selectedToken]
  );

  useEffect(() => {
    if (selectedToken) {
      let previousTokenTotal = 0;
      let previousUsdTotal = 0;

      for (let i = 0; i < index; i++) {
        if (streamSummary[i]) {
          const { tokenName, tokenTotal, usdTotal } = streamSummary[i];
          if (tokenName === selectedToken.value) {
            previousTokenTotal += tokenTotal;
            previousUsdTotal += usdTotal;
          }
        }
      }

      setPrevTokenTotal(previousTokenTotal);
      setPrevUsdTotal(previousUsdTotal);
    }
  }, [index, streamSummary, selectedToken]);

  useEffect(() => {
    if (selectedToken && tokenDetails) {
      const summary = {
        count: selectedCount,
        id: index,
        receivers: visibleReceivers,
        token: selectedToken,
        tokenName: selectedToken.value,
        tokenTotal: totalAmountInToken,
        estimatedNettFlowRate,
        usdTotal: 0,
        currentTokenBalance: tokenDetails.balance - prevTokenTotal,
        isInsufficientBalance:
          tokenDetails.balance - prevTokenTotal - totalAmountInToken < 0,
        tokenBalanceAfterPayment:
          tokenDetails.balance - prevTokenTotal - totalAmountInToken,
      };

      const newStreamSummary = [...streamSummary];
      newStreamSummary[index] = summary;
      if (!isEqual(streamSummary[index], newStreamSummary[index])) {
        dispatch(setStreamSummary(newStreamSummary));
      }
    }
  }, [
    dispatch,
    totalAmountInToken,
    index,
    streamSummary,
    prevTokenTotal,
    prevUsdTotal,
    selectedToken,
    selectedCount,
    tokenDetails,
    visibleReceivers,
  ]);

  useEffect(() => {
    if (streamSummary.length > batchLength) {
      // if batch is deleted, remove last entry
      dispatch(setStreamSummary(streamSummary.slice(0, -1)));
    }
  }, [streamSummary, batchLength, dispatch]);

  return (
    <div>
      <Card style={{ marginTop: "3rem" }}>
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Title>Paying from</Title>
              <div>
                <SelectToken
                  name={`batch[${index}].token`}
                  control={control}
                  required={`Currency is required`}
                  width="20rem"
                  options={tokensDropdown}
                  isSearchable
                  placeholder={`Select Currency...`}
                  defaultValue={item.token || null}
                  isLoading={loadingTokens}
                />
              </div>
              <div>
                <ErrorMessage
                  errors={errors}
                  name={`batch[${index}].token.message`}
                />
              </div>
            </div>
            {fields.length > 1 && (
              <RightRow alignItems={"center"}>
                <BatchName>Batch {index + 1}</BatchName>
                <Button
                  type="button"
                  iconOnly
                  className="p-0"
                  onClick={() => remove(index)}
                >
                  <Img src={DeleteSvg} alt="remove batch" width="20" />
                </Button>
              </RightRow>
            )}
          </div>

          <Title style={{ marginTop: "3rem" }}>Paying to</Title>
          <NestedStreamReceivers
            nestIndex={index}
            {...{
              control,
              register,
              watch,
              existingTokenDetails,
              errors,
              getValues,
              setReceivers,
              receivers,
              setValue,
            }}
          />
          <div className="mb-5">
            <StreamBatchSummary summary={streamSummary[index]} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function StreamBatches({
  control,
  register,
  watch,
  tokensDropdown,
  loadingTokens,
  existingTokenDetails,
  errors,
  getValues,
  setValue,
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
            <BatchContainer key={item.id}>
              <Batch
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
                  getValues,
                  setValue,
                }}
              />
            </BatchContainer>
          );
        })}
      </div>
    </>
  );
}

export default memo(StreamBatches);
