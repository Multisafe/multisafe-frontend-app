import React, { useMemo } from "react";

import { Circle, Inner } from "./styles";
// Add prop-types

const CircularProgress = ({ current, max, color, ...rest }) => {
  const percentage = useMemo(
    () => Math.floor((current / max) * 100),
    [current, max]
  );
  return (
    <Circle color={color} percentage={percentage} {...rest}>
      <svg>
        <circle cx="35" cy="35" r="35"></circle>
        <circle cx="35" cy="35" r="35"></circle>
      </svg>
      <Inner>
        {current} <span>OF</span> {max}
      </Inner>
    </Circle>
  );
};

export default CircularProgress;
