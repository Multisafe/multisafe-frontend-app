import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import LinkIcon from "assets/icons/dashboard/link-icon.svg";
import Img from "../Img";
import { getEtherscanLink } from "../Web3Utils";
import { networkId } from "constants/networks";

export default function EtherscanLink({
  id,
  type,
  address,
  hash,
  ...passThrough
}) {
  return (
    <div className="position-relative">
      <a
        href={getEtherscanLink({ chainId: networkId, type, address, hash })}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Img
          src={LinkIcon}
          id={id}
          alt="link"
          {...passThrough}
          width="14"
          data-for={id}
          data-tip={"View on Etherscan"}
        />
        <ReactTooltip id={id} place={"top"} type={"dark"} effect={"solid"} />
      </a>
    </div>
  );
}

EtherscanLink.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  address: PropTypes.string,
  hash: PropTypes.string,
};
