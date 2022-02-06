import { Input, InputLabel, InputRow } from "components/common/Form/styles";
import React from "react";
import { Controller } from "react-hook-form";

const TokenValueInput = ({ control, baseName, item, setValue, tokenName }) => {
  return (
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
            style={{ border: "none", minWidth: "9rem" }}
            onChange={(e) => {
              //   setValue(`${baseName}.fiatValue`, fiatValue);
              onChange(e);
            }}
            step=".0001"
          />
        </InputRow>
      )}
    />
  );
};

export default TokenValueInput;
