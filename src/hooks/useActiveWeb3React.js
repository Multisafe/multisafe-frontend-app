import { useContext } from "react";
import { Web3ReactContext } from "context/Web3ReactContext";

const useActiveWeb3React = () => {
  return useContext(Web3ReactContext);
};

export default useActiveWeb3React;
