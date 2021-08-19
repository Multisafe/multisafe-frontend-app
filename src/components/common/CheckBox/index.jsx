import React from "react";

import { Label } from "./styles";

export default function CheckBox({ label, ...rest }) {
  return (
    <Label>
      <span className="font-size-14">{label}</span>
      <input type="checkbox" {...rest} />
      <span className="custom-checkbox"></span>
    </Label>
  );
}
