import { useState } from "react";

import {
  useContract,
  useTransactionEffects,
  useBatchTransactions,
  useActiveWeb3React,
} from "hooks";
import { getAmountInWei } from "utils/tx-helpers";
import ERC20ABI from "constants/abis/ERC20.json";
import { useAddresses } from "hooks/useAddresses";
import { GAS_TOKEN_SYMBOL_BY_ID } from "constants/networks";

export default function useMassPayout() {
  const { ZERO_ADDRESS } = useAddresses();
  const { chainId } = useActiveWeb3React();

  const [baseRequestBody, setBaseRequestBody] = useState();
  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransactions();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  // contracts
  const customToken = useContract(ZERO_ADDRESS, ERC20ABI, true);

  const getERC20Contract = (contractAddress) => {
    if (contractAddress && customToken)
      return customToken.attach(contractAddress);
    return customToken;
  };

  const massPayout = async ({ receivers, tokenDetails, baseRequestBody }) => {
    setBaseRequestBody(baseRequestBody);

    if (!tokenDetails) return;

    let transactions = [];

    if (tokenDetails.name === GAS_TOKEN_SYMBOL_BY_ID[chainId]) {
      transactions = receivers.reduce((tx, { address, salaryAmount }) => {
        const transferAmount = getAmountInWei(
          salaryAmount,
          tokenDetails.decimals
        );

        // ETH
        tx.push({
          operation: 0, // CALL
          data: "0x",
          to: address,
          value: transferAmount,
        });
        return tx;
      }, []);
    } else {
      const erc20 = getERC20Contract(tokenDetails.address);
      if (!erc20) {
        throw new Error("ERC20 token undefined");
      }

      transactions = receivers.reduce((tx, { address, salaryAmount }) => {
        const transferAmount = getAmountInWei(
          salaryAmount,
          tokenDetails.decimals
        );

        // ERC20
        tx.push({
          operation: 0, // CALL
          to: erc20.address,
          value: 0,
          data: erc20.interface.encodeFunctionData("transfer", [
            address,
            transferAmount,
          ]),
        });

        return tx;
      }, []);
    }

    await executeBatchTransactions({ transactions });
  };

  const batchMassPayout = async ({
    batch,
    allTokenDetails,
    baseRequestBody,
  }) => {
    setBaseRequestBody(baseRequestBody);

    if (!allTokenDetails || !batch) return;

    let transactions = [];

    for (let { receivers, token } of batch) {
      const tokenDetails = allTokenDetails.find(
        ({ name }) => name === token.value
      );

      if (tokenDetails) {
        if (tokenDetails.name === GAS_TOKEN_SYMBOL_BY_ID[chainId]) {
          const ethTransferTxs = receivers.reduce(
            (tx, { address, tokenValue }) => {
              const transferAmount = getAmountInWei(
                tokenValue,
                tokenDetails.decimals
              );

              // ETH
              tx.push({
                operation: 0, // CALL
                data: "0x",
                to: address,
                value: transferAmount,
              });
              return tx;
            },
            []
          );

          transactions.push(...ethTransferTxs);
        } else {
          const erc20 = getERC20Contract(tokenDetails.address);
          if (!erc20) {
            throw new Error("ERC20 token undefined");
          }

          const erc20TransferTxs = receivers.reduce(
            (tx, { address, tokenValue }) => {
              const transferAmount = getAmountInWei(
                tokenValue,
                tokenDetails.decimals
              );

              // ERC20
              tx.push({
                operation: 0, // CALL
                to: erc20.address,
                value: 0,
                data: erc20.interface.encodeFunctionData("transfer", [
                  address,
                  transferAmount,
                ]),
              });

              return tx;
            },
            []
          );

          transactions.push(...erc20TransferTxs);
        }
      }
    }

    await executeBatchTransactions({ transactions });
  };

  return {
    loadingTx,
    txHash,
    massPayout,
    batchMassPayout,
    txData,
  };
}
