import { useContext } from "react";
import { Web3ReactContext } from "context/Web3ReactContext";

const useActiveWeb3React = () => {
  const context = useContext(Web3ReactContext);
  return context.active ? context : { onboard: context.onboard };
};

export default useActiveWeb3React;
