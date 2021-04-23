import { tokens } from "constants/index";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";

export const constructLabel = (tokenName, imgUrl) => {
  return (
    <div className="d-flex align-items-center">
      <img src={imgUrl} alt={tokenName} width="16" />
      <div className="ml-2 mt-1">{tokenName}</div>
    </div>
  );
};

export const defaultTokenOptions = [
  {
    value: tokens.DAI,
    label: constructLabel(tokens.DAI, DAIIcon),
  },
  {
    value: "USDC",
    label: constructLabel(tokens.USDC, USDCIcon),
  },
];
