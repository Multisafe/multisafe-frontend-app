import React, { useEffect, useState } from "react";
import { CurrencyInput } from "./styles";
import Button from "components/common/Button";
import SwapIcon from "assets/icons/dashboard/swap-icon.svg";
import Img from "../Img";
import { Input } from "./styles";

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
  selectedTokenDetails,
  setValue,
  ...rest
}) => {
  const [conversionValue, setConversionValue] = useState("");
  const [currentTokenName, setCurrentTokenName] = useState();
  const [swapped, setSwapped] = useState(false);

  const handleUsdValueChange = (value) => {
    setConversionValue(value);
    const tokenValue = value
      ? parseFloat(value / conversionRate).toFixed(4)
      : "";
    onChange(tokenValue);
  };

  const handleTokenValueChange = (value) => {
    setSwapped(false);

    const newConversionValue = value
      ? parseFloat(value * conversionRate).toFixed(4)
      : "";
    setConversionValue(newConversionValue);
    onChange(value);
  };

  useEffect(() => {
    if (!value) {
      setConversionValue("");
    } else {
      const newConversionValue = value
        ? parseFloat(value * conversionRate).toFixed(4)
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
      // setValue(name, conversionValue);
      onChange(conversionValue);
      const newConversionValue = conversionValue
        ? parseFloat(conversionValue * conversionRate).toFixed(4)
        : "";
      setConversionValue(newConversionValue);
    } else {
      setConversionValue(value);

      const tokenValue = value
        ? parseFloat(value / conversionRate).toFixed(4)
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
            <Button iconOnly type="button" onClick={handleToggleSwap}>
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
