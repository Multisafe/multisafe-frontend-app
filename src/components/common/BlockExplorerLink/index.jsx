import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import LinkIcon from "assets/icons/dashboard/link-icon.svg";
import Img from "../Img";
import { getBlockExplorerLink } from "../Web3Utils";
import { useActiveWeb3React } from "hooks";
import { BLOCK_EXPLORER_BY_ID } from "constants/networks";

export default function BlockExplorerLink({
  id,
  type,
  address,
  hash,
  ...passThrough
}) {
  const { chainId } = useActiveWeb3React();

  return (
    <div className="position-relative">
      <a
        href={getBlockExplorerLink({ chainId, type, address, hash })}
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
          data-tip={`View on ${BLOCK_EXPLORER_BY_ID[chainId]}`}
        />
        <ReactTooltip id={id} place={"top"} type={"dark"} effect={"solid"} />
      </a>
    </div>
  );
}

BlockExplorerLink.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  address: PropTypes.string,
  hash: PropTypes.string,
};
