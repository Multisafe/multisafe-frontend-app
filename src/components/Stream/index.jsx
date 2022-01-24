import React, { useCallback, useEffect } from "react";

import SF from "@superfluid-finance/js-sdk";
import { useActiveWeb3React } from "hooks";
import { useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { Button } from "components/common/Button/styles";

let sf, dai, daix, app;

export default function StreamUI() {
  const activeWeb3 = useActiveWeb3React();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const logSFDetails = useCallback(async () => {
    sf = new SF.Framework({
      ethers: activeWeb3.library,
      tokens: ["fDAI"],
    });
    await sf.initialize();

    console.log({ sf, ownerSafeAddress, activeWeb3 });
    const accounts = await sf.ethers.listAccounts();

    const sender = sf.user({
      address: ownerSafeAddress,
      token: "fDAI",
    });
    console.log({ accounts, sender });
    dai = await sf.contracts.TestToken.at(sf.tokens.fDAI.address);
    daix = sf.tokens.fDAIx;

    const allowedDAI = await dai.allowance.call(ownerSafeAddress, daix.address);

    console.log({ allowedDAI });
  }, [activeWeb3, ownerSafeAddress]);

  useEffect(() => {
    if (activeWeb3 && ownerSafeAddress) {
      logSFDetails();
    }
  }, [activeWeb3, ownerSafeAddress, logSFDetails]);

  return (
    <div>
      Hello Streaming
      <Button
        type="button"
        className="mx-auto d-block mt-3"
        // onClick={logSFDetails}
      >
        Log
      </Button>
    </div>
  );
}
