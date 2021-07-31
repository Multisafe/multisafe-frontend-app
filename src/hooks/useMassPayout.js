import { useState } from "react";
import { useSelector } from "react-redux";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";

import {
  useActiveWeb3React,
  useContract,
  useTransactionEffects,
  useBatchTransactions,
} from "hooks";
import { getAmountInWei } from "utils/tx-helpers";
import addresses from "constants/addresses";
import { DEFAULT_GAS_PRICE, tokens } from "constants/index";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ERC20ABI from "constants/abis/ERC20.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import { gnosisSafeTransactionV2Endpoint } from "constants/endpoints";

const { ZERO_ADDRESS } = addresses;

export default function useMassPayout() {
  const { account, library } = useActiveWeb3React();

  const [confirmTxData, setConfirmTxData] = useState("");
  const [baseRequestBody, setBaseRequestBody] = useState();
  const {
    executeBatchTransactions,
    loadingTx,
    setLoadingTx,
    txHash,
    setTxHash,
    txData,
    setTxData,
    setApproving,
    setRejecting,
    approving,
    rejecting,
    getAppropriateSignature,
  } = useBatchTransactions();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());

  // contracts
  const proxyContract = useContract(ownerSafeAddress, GnosisSafeABI, true);
  const customToken = useContract(ZERO_ADDRESS, ERC20ABI, true);

  const getERC20Contract = (contractAddress) => {
    if (contractAddress && customToken)
      return customToken.attach(contractAddress);
    return customToken;
  };

  const confirmMassPayout = async ({
    safe,
    to,
    value,
    data,
    operation,
    gasToken,
    safeTxGas,
    baseGas,
    gasPrice,
    refundReceiver,
    nonce,
    // safeTxHash,
    executor,
    // signatures,
    origin,
  }) => {
    if (account) {
      try {
        setLoadingTx(true);
        setTxHash("");
        setConfirmTxData("");

        try {
          let approvedSign;

          const contractTransactionHash =
            await proxyContract.getTransactionHash(
              to,
              value,
              data,
              operation,
              safeTxGas,
              baseGas,
              gasPrice,
              gasToken,
              executor || ZERO_ADDRESS,
              nonce
            );

          approvedSign = await getAppropriateSignature({
            to,
            value,
            data,
            operation,
            safeTxGas,
            baseGas,
            gasPrice,
            gasToken,
            refundReceiver,
            nonce,
            contractTransactionHash,
          });

          const txData = {
            // POST to gnosis
            to,
            value,
            data,
            operation,
            gasToken,
            safeTxGas,
            baseGas,
            gasPrice,
            refundReceiver,
            nonce,
            contractTransactionHash,
            sender: account,
            transactionHash: null,
            origin,
            signature: approvedSign.replace("0x", ""),
          };
          setConfirmTxData(txData);
        } catch (err) {
          setLoadingTx(false);
          console.log(err.message);
          setApproving(false);
          setRejecting(false);
        }
      } catch (err) {
        setLoadingTx(false);
        console.error(err);
      }
    }
  };

  const submitMassPayout = async (
    {
      safe,
      to,
      value,
      data,
      operation,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      // safeTxHash,
      executor,
      // signatures,
      origin,
      confirmations,
    },
    isMetaEnabled = false,
    isApproved = true
  ) => {
    if (account && library) {
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(account),
      });

      // (r, s, v) where v is 1 means this signature is approved by the address encoded in value r
      // For a single user, we auto generate the signature without prompting the user
      const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
        { type: "uint256", value: account }, // r
        { type: "uint256", value: 0 }, // s
        { type: "uint8", value: 1 } // v
      );

      let signatureBytes = "0x";
      try {
        setLoadingTx(true);
        setTxHash("");
        setTxData("");

        try {
          let approvedSign;
          // estimate using api
          const estimateResponse = await fetch(
            `${gnosisSafeTransactionV2Endpoint}${safe}/transactions/estimate/`,
            {
              method: "POST",
              body: JSON.stringify({
                safe,
                to,
                value,
                data,
                operation,
                gasToken,
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          const estimateResult = await estimateResponse.json();
          const { safeTxGas: finalSafeTxGas, baseGas: finalBaseGas } =
            estimateResult;
          const gasLimit =
            Number(finalSafeTxGas) + Number(finalBaseGas) + 21000; // giving a little higher gas limit just in case

          const contractTransactionHash =
            await proxyContract.getTransactionHash(
              to,
              value,
              data,
              operation,
              safeTxGas,
              baseGas,
              gasPrice,
              gasToken,
              executor || ZERO_ADDRESS,
              nonce
            );

          if (isMetaEnabled) {
            approvedSign = await getAppropriateSignature({
              to,
              value,
              data,
              operation,
              safeTxGas,
              baseGas,
              gasPrice,
              gasToken,
              refundReceiver,
              nonce,
              contractTransactionHash,
            });

            const confirmingAccounts = isApproved
              ? [
                  ...confirmations.map(
                    ({ owner, signature, approved }) =>
                      approved && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean)
              : [
                  ...confirmations.map(
                    ({ owner, signature, rejected }) =>
                      rejected && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean);

            if (!confirmingAccounts.find(({ owner }) => owner === account)) {
              confirmingAccounts.push({
                owner: account,
                signature: approvedSign,
              });
            }

            confirmingAccounts.sort((a, b) =>
              a.owner.toLowerCase() > b.owner.toLowerCase() ? 1 : -1
            );
            console.log({ confirmingAccounts });

            for (let i = 0; i < confirmingAccounts.length; i++) {
              signatureBytes += confirmingAccounts[i].signature.replace(
                "0x",
                ""
              );
            }

            const txData = {
              // POST to gnosis
              data: {
                to,
                value,
                data,
                operation,
                gasToken,
                safeTxGas,
                baseGas,
                gasPrice,
                refundReceiver,
                nonce,
                contractTransactionHash,
                sender: account,
                transactionHash: null, // will be added from BE after executing meta tx
                origin,
              },
              metaTxData: {
                to: ownerSafeAddress,
                from: ownerSafeAddress,
                params: [
                  to,
                  value,
                  data,
                  operation,
                  safeTxGas,
                  baseGas,
                  gasPrice,
                  gasToken,
                  executor || ZERO_ADDRESS,
                  signatureBytes,
                ],
                gasLimit,
              },
            };
            setTxData(txData);
          } else {
            const confirmingAccounts = isApproved
              ? [
                  ...confirmations.map(
                    ({ owner, signature, approved }) =>
                      approved && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean)
              : [
                  ...confirmations.map(
                    ({ owner, signature, rejected }) =>
                      rejected && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean);

            if (!confirmingAccounts.find(({ owner }) => owner === account)) {
              confirmingAccounts.push({
                owner: account,
                signature: autoApprovedSignature,
              });
            }

            confirmingAccounts.sort((a, b) =>
              a.owner.toLowerCase() > b.owner.toLowerCase() ? 1 : -1
            );

            console.log({ confirmingAccounts });

            for (let i = 0; i < confirmingAccounts.length; i++) {
              signatureBytes += confirmingAccounts[i].signature.replace(
                "0x",
                ""
              );
            }

            const tx = await proxyContract.execTransaction(
              to,
              value,
              data,
              operation,
              safeTxGas,
              baseGas,
              gasPrice,
              gasToken,
              executor || ZERO_ADDRESS, // executor
              signatureBytes,
              {
                gasLimit,
                gasPrice: averageGasPrice || DEFAULT_GAS_PRICE,
              }
            );
            setTxHash(tx.hash);
            console.log({ hash: tx.hash });

            setTxData({
              // POST to gnosis
              data: {
                to,
                value,
                data,
                operation,
                gasToken,
                safeTxGas,
                baseGas,
                gasPrice,
                refundReceiver,
                nonce,
                contractTransactionHash,
                sender: account,
                transactionHash: tx.hash,
                origin,
              },
            });

            await tx.wait();
          }
        } catch (err) {
          setLoadingTx(false);
          console.log(err.message);
          setApproving(false);
          setRejecting(false);
        }
      } catch (err) {
        setLoadingTx(false);
        console.error(err);
      }
    }
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

    console.log({ receivers, transactions });

    await executeBatchTransactions({ transactions });
  };

  return {
    loadingTx,
    txHash,
    massPayout,
    submitMassPayout,
    txData,
    setTxData,
    confirmTxData,
    setConfirmTxData,
    confirmMassPayout,
    setApproving,
    setRejecting,
    approving,
    rejecting,
  };
}
