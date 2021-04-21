import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import copy from "copy-to-clipboard";

import CopyIcon from "assets/icons/dashboard/copy-icon.svg";
import Img from "../Img";

export default function CopyButton({
  id,
  value,
  tooltip,
  children,
  ...passThrough
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 1500);
    }

    return () => clearTimeout(timer);
  }, [copied]);

  // TODO: Debounce the onClickCopy function
  const onClickCopy = useCallback(() => {
    copy(value);
    setCopied(true);
  }, [value]);

  return (
    <div className="position-relative">
      {!children ? (
        <Img
          src={CopyIcon}
          id={id}
          alt="copy"
          onClick={onClickCopy}
          width="14"
          style={{ cursor: "pointer" }}
          data-for={id}
          data-tip={tooltip}
          {...passThrough}
        />
      ) : (
        <div
          id={id}
          onClick={onClickCopy}
          data-for={id}
          data-tip={tooltip}
          {...passThrough}
        >
          {children}
        </div>
      )}
      <ReactTooltip
        id={id}
        place={"top"}
        type={"dark"}
        effect={"solid"}
        getContent={(dataTip) =>
          copied
            ? `Copied ${dataTip || ""}`.trimRight()
            : `Copy ${dataTip || ""}`.trimRight()
        }
      />
    </div>
  );
}

CopyButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tooltip: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
