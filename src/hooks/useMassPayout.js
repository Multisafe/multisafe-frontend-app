import { useState } from "react";

import {
  useContract,
  useTransactionEffects,
  useBatchTransactions,
} from "hooks";
import { getAmountInWei } from "utils/tx-helpers";
import addresses from "constants/addresses";
import { tokens } from "constants/index";
import ERC20ABI from "constants/abis/ERC20.json";

const { ZERO_ADDRESS } = addresses;

export default function useMassPayout() {
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

    if (tokenDetails.name !== tokens.ETH) {
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
    } else {
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
    }

    await executeBatchTransactions({ transactions });
  };

  const multiTokenMassPayout = async ({
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
        if (tokenDetails.name !== tokens.ETH) {
          const erc20 = getERC20Contract(tokenDetails.address);
          if (!erc20) {
            throw new Error("ERC20 token undefined");
          }

          const erc20TransferTxs = receivers.reduce(
            (tx, { address, amount }) => {
              const transferAmount = getAmountInWei(
                amount,
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
        } else {
          const ethTransferTxs = receivers.reduce((tx, { address, amount }) => {
            const transferAmount = getAmountInWei(
              amount,
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

          transactions.push(...ethTransferTxs);
        }
      }
    }

    await executeBatchTransactions({ transactions });
  };

  return {
    loadingTx,
    txHash,
    massPayout,
    multiTokenMassPayout,
    txData,
  };
}
