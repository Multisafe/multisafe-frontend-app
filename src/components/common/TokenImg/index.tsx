import { useSelector } from "react-redux";

import Img from "components/common/Img";
import { getDefaultIconIfPossible } from "constants/index";
import { makeSelectTokenIcons } from "store/tokens/selectors";

type Props = {
  token: string;
  width?: string;
  className?: string;
  address?: string;
};
export default function TokenImg({
  token,
  address,
  width,
  className,
  ...rest
}: Props) {
  const icons = useSelector(makeSelectTokenIcons());

  const tokenAddress = address ? address.toLowerCase() : "";
  return (
    <Img
      src={getDefaultIconIfPossible({ symbol: token, address: tokenAddress, icons })}
      alt="token"
      className={className || "mr-1"}
      width={width || "16"}
      {...rest}
    />
  );
}
