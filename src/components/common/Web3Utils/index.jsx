import { useState, useEffect } from "react";
import { formatEther } from "@ethersproject/units";
import { useActiveWeb3React } from "hooks";
import { networkNames } from "constants/networks";

export const ChainId = () => {
  const { chainId } = useActiveWeb3React();
  return Number.isInteger(chainId) ? chainId : "";
};

export const BlockNumber = () => {
  const { chainId, library } = useActiveWeb3React();
  const [blockNumber, setBlockNumber] = useState();
  useEffect(() => {
    if (!!library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((blockNumber) => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = (blockNumber) => {
        setBlockNumber(blockNumber);
      };
      library.on("block", updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener("block", updateBlockNumber);
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      {Number.isInteger(blockNumber)
        ? blockNumber.toLocaleString()
        : blockNumber === null
        ? "Error"
        : !!library
        ? "..."
        : ""}
    </>
  );
};

export const Account = (isFormat = true) => {
  const { account } = useActiveWeb3React();

  const accountNo =
    account === undefined ? null : account === null ? null : account;

  if (accountNo && isFormat) {
    return `${accountNo.substring(0, 9)}...${accountNo.substring(
      accountNo.length - 4
    )}`;
  }

  return accountNo;
};

export const Balance = () => {
  const { account, library, chainId } = useActiveWeb3React();

  const [balance, setBalance] = useState();
  useEffect(() => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return !!balance ? parseFloat(formatEther(balance)).toPrecision(4) : null;
};

const etherscanPrefixByChainId = {
  1: "",
  3: `${networkNames.ROPSTEN.toLowerCase()}.`,
  4: `${networkNames.RINKEBY.toLowerCase()}.`,
  42: `${networkNames.KOVAN.toLowerCase()}.`,
};
export const getEtherscanLink = ({ chainId, type = "tx", hash, address }) => {
  if (type === "tx") {
    return `https://${etherscanPrefixByChainId[chainId]}etherscan.io/${type}/${hash}`;
  } else if (type === "address") {
    return `https://${etherscanPrefixByChainId[chainId]}etherscan.io/${type}/${address}`;
  }
  return `https://${etherscanPrefixByChainId[chainId]}etherscan.io/`;
};

export const TransactionUrl = ({ hash, children }) => {
  const { chainId } = useActiveWeb3React();

  return (
    <a
      href={getEtherscanLink({ chainId, hash })}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children || `View Transaction`}
    </a>
  );
};

export const minifyAddress = (address) => {
  if (!address) return "";

  return `${address.substring(0, 9)}...${address.substring(
    address.length - 4
  )}`;
};
