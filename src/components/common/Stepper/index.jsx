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
  titleColor,
  last,
  stepStyles = {},
  ...rest
}) {
  return (
    <div className="step" style={stepStyles} {...rest}>
      <div className="step-info">
        <div
          className="step-circle"
          style={{ backgroundColor: backgroundColor || "#f2f2f2" }}
        >
          {icon && <span>{icon}</span>}
        </div>
        <div className="step-info-text">
          <div className="step-title">{title}</div>
          <div className="step-subtitle">{subtitle}</div>
        </div>
      </div>
      {!last && <div className="step-bar-right"></div>}
    </div>
  );
}
