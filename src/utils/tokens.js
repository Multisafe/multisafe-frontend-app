import { tokens } from "constants/index";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import Img from "components/common/Img";

export const constructLabel = ({ token, imgUrl, component: Component }) => {
  return (
    <div className="d-flex align-items-center">
      <Img src={imgUrl} alt={token} width="16" />
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
