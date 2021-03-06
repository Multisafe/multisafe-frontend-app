import React, { useEffect, useState } from "react";
import Big from "big.js";

import { CurrencyInput } from "./styles";
import Button from "components/common/Button";
import SwapIcon from "assets/icons/dashboard/swap-icon.svg";
import Img from "../Img";
import { Input } from "./styles";

Big.DP = 18;

const MultiCurrencyInputField = ({
  name,
  id,
  label,
  register,
  required,
  pattern,
  type,
  labelStyle = {},
  conversionRate,
  onChange,
  value,
  tokenName,
  ...rest
}) => {
  const [conversionValue, setConversionValue] = useState("");
  const [currentTokenName, setCurrentTokenName] = useState();
  const [swapped, setSwapped] = useState(false);

  const handleUsdValueChange = (value) => {
    setConversionValue(value);
    const tokenValue =
      value && conversionRate
        ? Big(value).div(Big(conversionRate)).toString()
        : "";
    onChange(tokenValue);
  };

  const handleTokenValueChange = (value) => {
    setSwapped(false);

    const newConversionValue =
      value && conversionRate
        ? Big(value).mul(Big(conversionRate)).toString()
        : "";
    setConversionValue(newConversionValue);
    onChange(value);
  };

  useEffect(() => {
    if (!value) {
      setConversionValue("");
    } else {
      const newConversionValue =
        value && conversionRate
          ? Big(value).mul(Big(conversionRate)).toString()
          : "";
      if (!conversionValue) setConversionValue(newConversionValue);
    }
  }, [value, conversionRate, conversionValue]);

  useEffect(() => {
    // reset the conversion value so that it gets
    // calculated automatically
    if (!currentTokenName) setCurrentTokenName(tokenName);
    else setConversionValue("");
  }, [tokenName, currentTokenName]);

  const handleToggleSwap = () => {
    const swap = !swapped;

    if (swap) {
      onChange(conversionValue);
      const newConversionValue =
        conversionValue && conversionRate
          ? Big(conversionValue).mul(Big(conversionRate)).toString()
          : "";
      setConversionValue(newConversionValue);
    } else {
      setConversionValue(value);

      const tokenValue =
        value && conversionRate
          ? Big(value).div(Big(conversionRate)).toString()
          : "";
      onChange(tokenValue);
    }
    setSwapped(swap);
  };

  return (
    <CurrencyInput>
      <div className="d-flex align-items-center">
        <div className="position-relative">
          <Input
            name={name}
            id={id || name}
            type={type}
            value={value}
            onChange={(e) => handleTokenValueChange(e.target.value)}
            step=".0001"
            style={{ paddingLeft: "4.4rem" }}
            {...rest}
          />
          <label htmlFor={id || name} className="static-text">
            {tokenName}
          </label>
        </div>
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
        <div className="position-relative">
          <Input
            name={"convertion"}
            type={"number"}
            placeholder="0.00"
            value={conversionValue}
            onChange={(e) => handleUsdValueChange(e.target.value)}
            style={{ paddingLeft: "3.3rem" }}
          />
          <label htmlFor={id || name} className="static-text">
            US$
          </label>
        </div>
      </div>
    </CurrencyInput>
  );
};

export default MultiCurrencyInputField;
