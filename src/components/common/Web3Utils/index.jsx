import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useActiveWeb3React } from "hooks";
import { NETWORK_NAMES } from "constants/networks";

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

  return !!balance
    ? parseFloat(ethers.utils.formatEther(balance)).toPrecision(4)
    : null;
};

const scanLinkByChainId = {
  1: "etherscan.io",
  3: `${NETWORK_NAMES.ROPSTEN.toLowerCase()}.etherscan.io`,
  4: `${NETWORK_NAMES.RINKEBY.toLowerCase()}.etherscan.io`,
  42: `${NETWORK_NAMES.KOVAN.toLowerCase()}.etherscan.io`,
  137: `polygonscan.com`,
  43114: `snowtrace.io`,
  56: `bscscan.com/`,
};

export const EXPLORER_LINK_TYPES = {
  TX: "tx",
  ADDRESS: "address",
};
export const getBlockExplorerLink = ({
  chainId,
  type = EXPLORER_LINK_TYPES.TX,
  hash,
  address,
}) => {
  if (type === EXPLORER_LINK_TYPES.TX) {
    return `https://${scanLinkByChainId[chainId]}/${type}/${hash}`;
  } else if (type === EXPLORER_LINK_TYPES.ADDRESS) {
    return `https://${scanLinkByChainId[chainId]}/${type}/${address}`;
  }
  return `https://${scanLinkByChainId[chainId]}/`;
};

export const TransactionUrl = ({ hash, children, ...rest }) => {
  const { chainId } = useActiveWeb3React();

  return (
    <a
      href={getBlockExplorerLink({ chainId, hash })}
      rel="noopener noreferrer"
      target="_blank"
      {...rest}
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
