import React from "react";
import { SimpleInput } from "./styles";

export default function ControlledInput({
  type,
  name,
  id,
  value,
  onChange,
  placeholder,
  ...rest
}) {
  return (
    <SimpleInput
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
