import useActiveWeb3React from "./useActiveWeb3React";
import { useAddresses } from "./useAddresses";

export default function useStream() {
  const { ZERO_ADDRESS } = useAddresses();
  const { chainId } = useActiveWeb3React();

  const getAllowance = () => {};
  const approve = () => {};
  const upgrade = () => {};
  const startStream = () => {};
  const stopStream = () => {};
  const updateStream = () => {};
  const getStreamStatus = () => {};
}
