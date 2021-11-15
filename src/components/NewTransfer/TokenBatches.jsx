import { memo, useEffect, useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { isEqual } from "lodash";

import Button from "components/common/Button";
import { SelectToken } from "components/common/Form";
import { makeSelectPrices } from "store/tokens/selectors";
import DeleteSvg from "assets/icons/delete-bin.svg";
import Img from "components/common/Img";
import { setTransferSummary } from "store/new-transfer/actions";
import { makeSelectTransferSummary } from "store/new-transfer/selectors";
import NestedReceivers from "./NestedReceivers";
import TokenSummary from "./TokenSummary";
import { Card } from "components/common/Card";
import { Title, BatchContainer } from "./styles/NewTransfer";

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
  const [prevTokenTotal, setPrevTokenTotal] = useState(0);
  const [prevUsdTotal, setPrevUsdTotal] = useState(0);
  const [receivers, setReceivers] = useState([]);

  const selectedToken = useWatch({ control, name: `batch[${index}].token` });
  const visibleReceivers = useWatch({
    control,
    name: `batch[${index}].receivers`,
    defaultValue: [],
  });
  const selectedCount = visibleReceivers && visibleReceivers.length;

  const dispatch = useDispatch();

  // Selectors
  const prices = useSelector(makeSelectPrices());
  const transferSummary = useSelector(makeSelectTransferSummary());

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
        if (transferSummary[i]) {
          const { tokenName, tokenTotal, usdTotal } = transferSummary[i];
          if (tokenName === selectedToken.value) {
            previousTokenTotal += tokenTotal;
            previousUsdTotal += usdTotal;
          }
        }
      }

      setPrevTokenTotal(previousTokenTotal);
      setPrevUsdTotal(previousUsdTotal);
    }
  }, [index, transferSummary, selectedToken]);

  useEffect(() => {
    if (selectedToken && tokenDetails) {
      const summary = {
        id: index,
        tokenName: selectedToken.value,
        receivers: visibleReceivers,
        count: selectedCount,
        tokenTotal: totalAmountInToken,
        usdTotal: totalAmountInUsd,
        isInsufficientBalance:
          tokenDetails.balance - prevUsdTotal - totalAmountInToken < 0,
        currentTokenBalance: tokenDetails.balance - prevTokenTotal,
        currentUsdBalance: tokenDetails.usd - prevUsdTotal,
        tokenBalanceAfterPayment:
          tokenDetails.balance - prevUsdTotal - totalAmountInToken,
        usdBalanceAfterPayment:
          tokenDetails.usd - prevUsdTotal - totalAmountInUsd,
      };

      const newTransferSummary = [...transferSummary];
      newTransferSummary[index] = summary;
      if (!isEqual(transferSummary[index], newTransferSummary[index])) {
        dispatch(setTransferSummary(newTransferSummary));
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
    selectedCount,
    tokenDetails,
    visibleReceivers,
  ]);

  useEffect(() => {
    if (transferSummary.length > batchLength) {
      // if batch is deleted, remove last entry
      dispatch(setTransferSummary(transferSummary.slice(0, -1)));
    }
  }, [transferSummary, batchLength, dispatch]);

  return (
    <div>
      <Card style={{ marginTop: "3rem" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Title>Paying From</Title>
            <div>
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
            <Button
              type="button"
              iconOnly
              className="p-0"
              onClick={() => remove(index)}
            >
              <Img src={DeleteSvg} alt="remove batch" width="20" />
            </Button>
          )}
        </div>

        <Title style={{ marginTop: "3rem" }}>Paying To</Title>
        <NestedReceivers
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
          <TokenSummary summary={transferSummary[index]} />
        </div>
      </Card>
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

export default memo(TokenBatches);
