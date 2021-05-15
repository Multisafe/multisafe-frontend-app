import { tokens } from "constants/index";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";

export const constructLabel = ({ token, imgUrl, component: Component }) => {
  return (
    <div className="d-flex align-items-center">
      <img src={imgUrl} alt={token} width="16" />
      <div className="ml-2 mt-1">{Component ? Component : token}</div>
    </div>
  );
};

export const defaultTokenOptions = [
  {
    value: tokens.DAI,
    label: constructLabel({ token: tokens.DAI, imgUrl: DAIIcon }),
  },
];
