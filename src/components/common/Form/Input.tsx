import React, { ReactNode, CSSProperties } from "react";

import { Input } from "./styles";

type Props = {
  type: string;
  inputmode?: string;
  autoComplete?: string;
  autoCorrect?: string;
  name: string;
  id: string;
  value?: FixMe;
  onChange?: FixMe;
  placeholder?: string;
  disabled?: boolean;
  label?: ReactNode;
  required?: boolean;
  pattern?: FixMe;
  register?: FixMe;
  labelStyle?: CSSProperties;
  step?: FixMe;
};

const InputField = ({
  name,
  id,
  label,
  register,
  required = false,
  pattern,
  type,
  labelStyle = {},
  ...rest
}: Props) => (
  <>
    <Input
      name={name}
      id={id || name}
      ref={register ? register({ required, pattern }) : undefined}
      type={type}
      {...rest}
    />
    {label ? (
      <label htmlFor={id || name} style={labelStyle}>
        {label}
      </label>
    ) : null}
  </>
);

export default InputField;
