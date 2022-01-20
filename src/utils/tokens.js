import React from "react";
import { TOKEN_SYMBOLS } from "constants/index";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import Img from "components/common/Img";
import TokenImg from "components/common/TokenImg";

export const constructLabel = ({ token, address = "", imgUrl, component: Component }) => {
  const renderIcon = () => {
    if (imgUrl) {
      return <Img src={imgUrl} alt={token} width="16" />;
    } else if (address || token) {
      return <TokenImg token={token} address={address} width={16}/>
    }

    return null;
  };

  return (
    <div className="d-flex align-items-center">
      {renderIcon()}
      <div className="ml-2 mt-1">{Component ? Component : token}</div>
    </div>
  );
};

export const defaultTokenOptions = [
  {
    value: TOKEN_SYMBOLS.DAI,
    label: constructLabel({ token: TOKEN_SYMBOLS.DAI, imgUrl: DAIIcon }),
  },
];
