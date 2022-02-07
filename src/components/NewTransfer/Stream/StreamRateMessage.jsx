import React, { memo } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/number-helpers";

const StyledP = styled.p`
  margin: 2rem 0;
  color: #989898;
  font-size: 1.4rem;
`;

const StreamRateMessage = ({ tokenValue, duration = 1, tokenName, style }) => {
  const streamRate = Number(tokenValue) / duration;
  return (
    <StyledP style={style}>
      Streaming per second {formatNumber(streamRate, 8)} {tokenName || ""}
    </StyledP>
  );
};

export default memo(StreamRateMessage);
