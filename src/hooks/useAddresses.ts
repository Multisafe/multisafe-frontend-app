import useActiveWeb3React from "./useActiveWeb3React";
import { ADDRESSES } from "constants/addresses";

export const useAddresses = () => {
  const { chainId } = useActiveWeb3React();

  return ADDRESSES[chainId];
};
