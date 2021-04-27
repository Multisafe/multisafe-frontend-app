import React from "react";

import Button from "components/common/Button";
import { useActiveWeb3React } from "hooks";
import { useState } from "react";

const ConnectToWallet = ({ className, ...rest }) => {
  const { onboard } = useActiveWeb3React();
  const [loading, setLoading] = useState();

  const handleClick = async () => {
    if (onboard) {
      setLoading(true);
      try {
        const walletSelected = await onboard.walletSelect();
        if (walletSelected) {
          const ready = await onboard.walletCheck();
          if (!ready) {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={handleClick}
        className={className}
        loading={loading}
        disabled={loading}
        {...rest}
      >
        <span>Connect</span>
      </Button>
    </div>
  );
};

export default ConnectToWallet;
