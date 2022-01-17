import React from "react";
import CopyButton from "../Copy";
import EtherscanLink from "../EtherscanLink";
import { ETHERSCAN_LINK_TYPES, minifyAddress } from "../Web3Utils";
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
  address,
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

  const minifiedOwnerAddress = minifyAddress(address);
  return (
    <div className="step" style={stepStyles} {...rest}>
      <div className="step-container">
        <div className="step-bar-left"></div>

        <div className="step-circles">
          <div
            className="step-circle"
            style={{ backgroundColor: backgroundColor || "#f2f2f2" }}
          />
          <div
            className="outer-step-circle"
            style={{ backgroundColor: backgroundColor || "#f2f2f2" }}
          />
        </div>
        <div className="step-bar-right"></div>
      </div>

      <div className="step-info-text">
        <div className="step-title">{title}</div>
        {address && (<div className="step-owner d-flex mt-2">
          <span className="address">{minifiedOwnerAddress}</span>
          <CopyButton
            id={`owner-address-${minifiedOwnerAddress}`}
            tooltip="address"
            value={address || ""}
            className="mr-3"
            stopPropagation
          />
          <EtherscanLink
            id={`etherscan-link-${minifiedOwnerAddress}`}
            type={ETHERSCAN_LINK_TYPES.ADDRESS}
            address={address}
          />
        </div>)}
        <div className="step-subtitle">{subtitle}</div>
        {renderInitiatorAndExecutor(isInitiator, isExecutor)}
      </div>
    </div>
  );
}
