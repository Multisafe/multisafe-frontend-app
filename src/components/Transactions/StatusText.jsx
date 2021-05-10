import React from "react";
import { StatusCircle, ColoredText } from "./styles";

export default function StatusText({ status, textOnly, ...rest }) {
  if (textOnly) {
    switch (status) {
      case 0:
        return (
          <ColoredText color="#6cb44c" {...rest}>
            Completed
          </ColoredText>
        );

      case 1:
        return (
          <ColoredText color="#fcbc04" {...rest}>
            Pending
          </ColoredText>
        );

      case 2:
        return (
          <ColoredText color="#ff4660" {...rest}>
            Failed
          </ColoredText>
        );

      default:
        return null;
    }
  }
  switch (status) {
    case 0:
      return (
        <div className="d-flex align-items-center">
          <div>Completed</div>
          <StatusCircle color="#3bd800" className="ml-3" />
        </div>
      );

    case 1:
      return (
        <div className="d-flex align-items-center">
          <div>Pending</div>
          <StatusCircle color="#f7e72e" className="ml-3" />
        </div>
      );

    case 2:
      return (
        <div className="d-flex align-items-center">
          <div>Failed</div>
          <StatusCircle color="#f71ea3" className="ml-3" />
        </div>
      );

    default:
      return null;
  }
}
