import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { CurrencyInput } from "./styles";
import Button from "components/common/Button";

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
  ...rest
}) => {
  const [conversionValue, setConversionValue] = useState("");
  const [toggleFlex, setToggleFlex] = useState(false);
  const [currentTokenName, setCurrentTokenName] = useState();

  const handleUsdValueChange = (e) => {
    setConversionValue(e.target.value);
    const tokenValue = e.target.value
      ? parseFloat(e.target.value / conversionRate).toFixed(4)
      : "";
    onChange(tokenValue);
  };

  const handleTokenValueChange = (e) => {
    const newConversionValue = e.target.value
      ? parseFloat(e.target.value * conversionRate).toFixed(4)
      : "";
    setConversionValue(newConversionValue);
    onChange(e.target.value);
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

  const handleToggleFlex = () => {
    setToggleFlex((flex) => !flex);
  };

  return (
    <CurrencyInput className="position-relative">
      <div className="d-flex align-items-center">
        <div
          className="d-flex w-100"
          style={{
            flexDirection: toggleFlex ? "column-reverse" : "column",
          }}
        >
          <div className="tokenAmount">
            <span>{tokenName}</span>
            <input
              name={name}
              id={id || name}
              // ref={register({ required, pattern })}
              type={type}
              value={value}
              onChange={handleTokenValueChange}
              step=".0001"
              {...rest}
            />
          </div>
          <div className="usdAmount">
            <span>US$</span>
            <input
              name={"convertion"}
              type={"number"}
              placeholder="0.00"
              value={conversionValue}
              onChange={handleUsdValueChange}
            />
          </div>
        </div>
        <div>
          <div className="convert">
            <Button
              iconOnly
              type="button"
              onClick={handleToggleFlex}
              style={{ color: "#373737" }}
            >
              <FontAwesomeIcon icon={faExchangeAlt} color="#373737" />
            </Button>
          </div>
        </div>
      </div>
    </CurrencyInput>
  );
};

export default MultiCurrencyInputField;
