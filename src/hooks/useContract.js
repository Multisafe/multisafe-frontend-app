import { useMemo } from "react";
// import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import useActiveWeb3React from "./useActiveWeb3React";
// import useActiveWeb3React from "./useActiveWeb3React";

export default function useContract(address, ABI, withSigner = false) {
  const { library, account } = useActiveWeb3React();
  return useMemo(
    () =>
      !!address && !!ABI && !!library
        ? new ethers.Contract(
            address,
            ABI,
            withSigner ? library.getSigner(account).connectUnchecked() : library
          )
        : undefined,
    [address, ABI, withSigner, library, account]
  );
}
