import React from "react";
import { LoadingContainer } from "./styles";

const Loading = ({
  className = '',
  color = "#fff",
  width = "2rem",
  height = "2rem",
  ...rest
}) => {
  const colorMapping = { primary: "#1452f5", secondary: "#fff" };
  return (
    <LoadingContainer className={className} {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke={colorMapping[color] || color}
          strokeWidth="10"
          r="35"
          strokeDasharray="164.93361431346415 56.97787143782138"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1.01010101010101s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </circle>
      </svg>
    </LoadingContainer>
  );
};

export default Loading;
