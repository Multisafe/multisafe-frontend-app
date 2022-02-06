import { useState } from "react";
import { useSelector } from "react-redux";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";

import { useActiveWeb3React, useContract, useBatchTransactions } from "hooks";
import { DEFAULT_GAS_PRICE } from "constants/index";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectSelectedGasPriceInWei } from "store/gas/selectors";
import { useAddresses } from "hooks/useAddresses";
import { useEstimateTransaction } from "hooks/useEstimateTransaction";

export default function useMultisigActions() {
  const { account, library } = useActiveWeb3React();
  const { ZERO_ADDRESS } = useAddresses();
  const { estimateTransaction } = useEstimateTransaction();

  const [confirmTxData, setConfirmTxData] = useState("");
  const {
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

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const selectedGasPrice = useSelector(makeSelectSelectedGasPriceInWei());

  // contracts
  const proxyContract = useContract(safeAddress, GnosisSafeABI, true);

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

          const { safeTxGas: finalSafeTxGas, baseGas: finalBaseGas } =
            await estimateTransaction({
              to,
              value,
              data,
              operation,
              gasToken,
            });

          const gasLimit =
            Number(finalSafeTxGas || 0) + Number(finalBaseGas || 0) + 21000; // giving a little higher gas limit just in case

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
                to: safeAddress,
                from: safeAddress,
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

            const txData = [
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
                gasPrice: selectedGasPrice || DEFAULT_GAS_PRICE,
              },
            ];

            const tx = await proxyContract.execTransaction(...txData);
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
                // transactionHash: tx.hash,
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

  return {
    loadingTx,
    txHash,
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
