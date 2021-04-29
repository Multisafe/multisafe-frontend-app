import React from "react";

import { Label } from "./styles";

export default function CheckBox({ label, ...rest }) {
  return (
    <Label>
      <span>{label}</span>
      <input type="checkbox" {...rest} />
      <span className="custom-checkbox"></span>
    </Label>
  );
}
