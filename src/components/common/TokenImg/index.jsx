import React from "react";
import { useSelector } from "react-redux";

import Img from "components/common/Img";
import { getDefaultIconIfPossible } from "constants/index";
import { makeSelectTokenIcons } from "store/tokens/selectors";

export default function TokenImg({ token, width, className, ...rest }) {
  const icons = useSelector(makeSelectTokenIcons());

  return (
    <Img
      src={getDefaultIconIfPossible(token, icons)}
      alt="token"
      className={className || "mr-1"}
      width={width || "16"}
      {...rest}
    />
  );
}
