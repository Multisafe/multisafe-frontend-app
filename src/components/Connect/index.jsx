import React from "react";
import { startCase } from "lodash";

import { Account } from "components/common/Web3Utils";
import { findNetworkNameByWeb3ChainId } from "constants/networks";
import Button from "components/common/Button";
import { useActiveWeb3React } from "hooks";

const ConnectToWallet = ({ className, ...rest }) => {
  const { chainId, active, onboard } = useActiveWeb3React();

  const handleClick = async () => {
    if (onboard) {
      await onboard.walletSelect();
      await onboard.walletCheck();
    }
  };

  const getNetworkName = () => {
    return startCase(findNetworkNameByWeb3ChainId(chainId));
  };

  return (
    <div>
      <Button
        type="button"
        onClick={handleClick}
        className={className}
        {...rest}
      >
        {!active ? (
          <span>Connect</span>
        ) : (
          <span>
            {getNetworkName()} <Account />
          </span>
        )}
      </Button>
    </div>
  );
};

export default ConnectToWallet;
