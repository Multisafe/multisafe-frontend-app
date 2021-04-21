import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { SimpleStepper, SimpleStepperContent } from "./styles";

export function Stepper({ children, ...rest }) {
  return <SimpleStepper {...rest}>{children}</SimpleStepper>;
}

export function StepperContent({ active, text, last, ...rest }) {
  return (
    <SimpleStepperContent active={active} {...rest}>
      <FontAwesomeIcon icon={faCheckCircle} className="step-check" />
      <div className="step-text">{text}</div>
      {!last && <div className="step-dash"></div>}
    </SimpleStepperContent>
  );
}
