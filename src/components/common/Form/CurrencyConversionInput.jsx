import { useEffect, useState } from "react";
import Big from "big.js";
import { Controller, useWatch } from "react-hook-form";
import ReactTooltip from "react-tooltip";

import Button from "components/common/Button";
import SwapIcon from "assets/icons/dashboard/swap-icon.svg";
import Img from "components/common/Img";
import InfoIcon from "assets/icons/dashboard/info-icon.svg";
import { Input, InputRow, InputLabel } from "./styles";

Big.DP = 18;

const CurrencyConversionInputField = ({
  control,
  baseName,
  item,
  tokenName,
  setValue,
  conversionRate,
}) => {
  const [swapped, setSwapped] = useState(false);
  const [currentTokenName, setCurrentTokenName] = useState();
  const [showNoConversionInfo, setShowNoConversionInfo] = useState(false);

  const watchFiatValue = useWatch({ control, name: `${baseName}.fiatValue` });
  const watchTokenValue = useWatch({ control, name: `${baseName}.tokenValue` });

  useEffect(() => {
    // reset the conversion value so that it gets
    // calculated automatically
    if (!currentTokenName) {
      setCurrentTokenName(tokenName);
    } else if (tokenName !== currentTokenName) {
      setValue(`${baseName}.fiatValue`, "");
      setCurrentTokenName(tokenName);
    }
  }, [tokenName, currentTokenName, setValue, baseName]);

  useEffect(() => {
    // if either one of token/fiat value is empty, recalculate and set
    if (Number(watchFiatValue) && !watchTokenValue && Number(conversionRate)) {
      const tokenValue = Big(watchFiatValue)
        .div(Big(conversionRate))
        .toString();

      setValue(`${baseName}.tokenValue`, tokenValue);
    } else if (!Number(watchFiatValue) && watchTokenValue && conversionRate) {
      const fiatValue =
        watchTokenValue && conversionRate
          ? Big(watchTokenValue).mul(Big(conversionRate)).toString()
          : "";
      setValue(`${baseName}.fiatValue`, fiatValue);
    } else if (!Number(conversionRate) && Number(watchFiatValue)) {
      // No usd conversion found, keep fiatValue empty and show a notification
      setValue(`${baseName}.fiatValue`, "");
    }
  }, [watchFiatValue, watchTokenValue, setValue, baseName, conversionRate]);

  useEffect(() => {
    if (!Number(conversionRate)) {
      setShowNoConversionInfo(true);
    } else {
      setShowNoConversionInfo(false);
    }
  }, [conversionRate]);

  const handleToggleSwap = () => {
    const isSwapped = !swapped;
    if (isSwapped) {
      setValue(`${baseName}.tokenValue`, watchFiatValue);
      setValue(`${baseName}.fiatValue`, "");
    } else {
      setValue(`${baseName}.fiatValue`, watchTokenValue);
      setValue(`${baseName}.tokenValue`, "");
    }
    setSwapped(isSwapped);
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <Controller
          control={control}
          name={`${baseName}.tokenValue`}
          rules={{
            required: "Token amount is required",
            validate: (value) => {
              if (value <= 0) return "Please check the token amount";

              return true;
            },
          }}
          defaultValue={item?.tokenValue || ""}
          render={({ onChange, value }) => (
            <InputRow>
              <InputLabel htmlFor={`${baseName}.tokenValue`}>
                {tokenName}
              </InputLabel>

              <Input
                type="number"
                name={`${baseName}.tokenValue`}
                value={value}
                placeholder="0.00"
                id={`${baseName}.tokenValue`}
                style={{ border: "none", minWidth: "6rem" }}
                onChange={(e) => {
                  const tokenValue = e.target.value;
                  const fiatValue =
                    tokenValue && conversionRate
                      ? Big(tokenValue).mul(Big(conversionRate)).toString()
                      : "";
                  setValue(`${baseName}.fiatValue`, fiatValue);

                  onChange(e);
                }}
                step=".0001"
              />
            </InputRow>
          )}
        />
        <div>
          <div className="convert">
            <Button
              iconOnly
              type="button"
              onClick={handleToggleSwap}
              style={{ padding: "1rem" }}
            >
              <Img src={SwapIcon} alt="swap" />
            </Button>
          </div>
        </div>

        <Controller
          control={control}
          name={`${baseName}.fiatValue`}
          rules={{
            required: "Fiat amount is required",
            validate: (value) => {
              if (value < 0) return "Please check the fiat amount";

              return true;
            },
          }}
          defaultValue={item?.fiatValue || ""}
          render={({ onChange, value }) => (
            <InputRow>
              <InputLabel htmlFor={`${baseName}.fiatValue`}>US$</InputLabel>

              <Input
                type="number"
                name={`${baseName}.fiatValue`}
                value={value}
                placeholder="0.00"
                id={`${baseName}.fiatValue`}
                style={{ border: "none" }}
                onChange={(e) => {
                  const fiatValue = e.target.value;
                  const tokenValue =
                    fiatValue && Number(conversionRate)
                      ? Big(fiatValue).div(Big(conversionRate)).toString()
                      : "";
                  setValue(`${baseName}.tokenValue`, tokenValue);
                  onChange(e);
                }}
                step=".0001"
              />
            </InputRow>
          )}
        />

        {showNoConversionInfo && (
          <>
            <Img
              id={`no-conversion-${baseName}`}
              src={InfoIcon}
              alt="info"
              data-for={`no-conversion-${baseName}`}
              data-tip={`Fiat conversion is not <br />available for ${tokenName}`}
              className="ml-3"
            />
            <ReactTooltip
              id={`no-conversion-${baseName}`}
              place={"top"}
              type={"dark"}
              effect={"solid"}
              multiline={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencyConversionInputField;
