import React from "react";

import { HorizontalStepper } from "./styles";

export function Stepper({ children, count }) {
  return <HorizontalStepper count={count}>{children}</HorizontalStepper>;
}

export function StepCircle({
  icon,
  backgroundColor,
  title,
  subtitle,
  isInitiator,
  isExecutor,
  titleColor,
  stepStyles = {},
  ...rest
}) {
  const renderInitiatorAndExecutor = (isInitiator, isExecutor) => {
    let text = "";
    if (isInitiator && isExecutor) {
      text = "Initiator/Executor";
    } else if (isInitiator) {
      text = "Initiator";
    } else if (isExecutor) {
      text = "Executor";
    }

    return text && <div className="step-text">{text}</div>;
  };
  return (
    <div className="step" style={stepStyles} {...rest}>
      <div className="step-container">
        <div className="step-bar-left"></div>

        <div className="step-circles">
          <div
            className="step-circle"
            style={{ backgroundColor: backgroundColor || "#f2f2f2" }}
          ></div>
          <div
            className="outer-step-circle"
            style={{ backgroundColor: backgroundColor || "#f2f2f2" }}
          ></div>
        </div>
        <div className="step-bar-right"></div>
      </div>

      <div className="step-info-text">
        <div className="step-title">{title}</div>
        <div className="step-subtitle">{subtitle}</div>
        {renderInitiatorAndExecutor(isInitiator, isExecutor)}
      </div>
    </div>
  );
}
