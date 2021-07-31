import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { arrayify } from "@ethersproject/bytes";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";

import { useActiveWeb3React, useContract } from "hooks";
import {
  joinHexData,
  getHexDataLength,
  standardizeTransaction,
} from "utils/tx-helpers";
import addresses from "constants/addresses";
import { DEFAULT_GAS_PRICE } from "constants/index";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import MultiSendABI from "constants/abis/MultiSend.json";
import {
  makeSelectOwnerSafeAddress,
  makeSelectIsMultiOwner,
} from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import { gnosisSafeTransactionV2Endpoint } from "constants/endpoints";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import metaTxReducer from "store/metatx/reducer";
import metaTxSaga from "store/metatx/saga";
import { makeSelectNonce } from "store/safe/selectors";

const { MULTISEND_ADDRESS, ZERO_ADDRESS } = addresses;
const metaTxKey = "metatx";

export default function useBatchTransaction() {
  const { account, library, connector } = useActiveWeb3React();

  const [loadingTx, setLoadingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txData, setTxData] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [isHardwareWallet, setIsHardwareWallet] = useState(false);

  useInjectReducer({ key: metaTxKey, reducer: metaTxReducer });

  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const multisigNonce = useSelector(makeSelectNonce());

  // contracts
  const proxyContract = useContract(safeAddress, GnosisSafeABI, true);
  const multiSend = useContract(MULTISEND_ADDRESS, MultiSendABI);

  useEffect(() => {
    if (connector) {
      if (connector.name === "Ledger" || connector.name === "Trezor") {
        setIsHardwareWallet(true);
      } else {
        setIsHardwareWallet(false);
      }
    }
  }, [connector]);

  const encodeMultiSendCallData = (transactions, ethLibAdapter) => {
    const standardizedTxs = transactions.map(standardizeTransaction);

    return multiSend.interface.encodeFunctionData("multiSend", [
      joinHexData(
        standardizedTxs.map((tx) =>
          ethLibAdapter.abiEncodePacked(
            { type: "uint8", value: tx.operation },
            { type: "address", value: tx.to },
            { type: "uint256", value: tx.value },
            { type: "uint256", value: getHexDataLength(tx.data) },
            { type: "bytes", value: tx.data }
          )
        )
      ),
    ]);
  };

  let signTypedData = async function (account, typedData) {
    return new Promise(async function (resolve, reject) {
      // const digest = TypedDataUtils.encodeDigest(typedData);
      try {
        const signer = library.getSigner(account);

        const address = await signer.getAddress();
        const signature = await library.send("eth_signTypedData_v3", [
          address,
          JSON.stringify({
            domain: typedData.domain,
            types: typedData.types,
            message: typedData.message,
            primaryType: "SafeTx",
          }),
        ]);

        if (signature) {
          resolve(signature.replace("0x", ""));
        }
      } catch (err) {
        return reject(err);
      }
    });
  };

  let ethSigner = async function (account, safeTxHash) {
    return new Promise(function (resolve, reject) {
      // const digest = TypedDataUtils.encodeDigest(typedData);
      try {
        const signer = library.getSigner(account);

        signer
          .signMessage(arrayify(safeTxHash))
          .then((signature) => {
            let sigV = parseInt(signature.slice(-2), 16);
            // Metamask with ledger returns v = 01, this is not valid for ethereum
            // For ethereum valid V is 27 or 28
            // In case V = 0 or 01 we add it to 27 and then add 4
            // Adding 4 is required to make signature valid for safe contracts:
            // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#eth-sign-signature
            switch (sigV) {
              case 0:
              case 1:
                sigV += 31;
                break;
              case 27:
              case 28:
                sigV += 4;
                break;
              default:
                throw new Error("Invalid signature");
            }

            let finalSignature = signature.slice(0, -2) + sigV.toString(16);
            resolve(finalSignature.replace("0x", ""));
          })
          .catch((err) => {
            console.error(err);
            setLoadingTx(false);
            setApproving(false);
            setRejecting(false);
          });
      } catch (err) {
        setLoadingTx(false);
        setApproving(false);
        setRejecting(false);
        return reject(err);
      }
    });
  };

  const eip712Signer = async (
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
    contractTransactionHash
  ) => {
    const domain = {
      verifyingContract: safeAddress,
    };

    const types = {
      EIP712Domain: [{ type: "address", name: "verifyingContract" }],
      SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
      ],
    };

    const message = {
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
    };

    const typedData = {
      domain,
      types,
      message,
    };

    let signatureBytes = "0x";

    let signature;

    try {
      signature = await signTypedData(account, typedData);
      return signatureBytes + signature;
    } catch (err) {
      console.error(err);
      try {
        // Metamask with ledger or trezor doesn't work with eip712
        // In this case, show a simple eth_sign signature
        if (
          connector.name === "MetaMask" &&
          err.message.includes("Not supported on this device")
        ) {
          const signature = await ethSigner(account, contractTransactionHash);
          return signatureBytes + signature;
        } else {
          setLoadingTx(false);
          setApproving(false);
          setRejecting(false);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getAppropriateSignature = async ({
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
  }) => {
    let approvedSign;
    if (isHardwareWallet) {
      approvedSign = await ethSigner(account, contractTransactionHash);
    } else {
      approvedSign = await eip712Signer(
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
        contractTransactionHash
      );
    }
    return approvedSign;
  };

  const executeBatchTransactions = async ({ transactions }) => {
    if (account && library) {
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(account),
      });
      const dataHash = encodeMultiSendCallData(transactions, ethLibAdapter);

      // Set parameters of execTransaction()
      const to = MULTISEND_ADDRESS;
      const valueWei = 0;
      const data = dataHash;
      const operation = 1; // DELEGATECALL
      const gasPrice = 0; // If 0, then no refund to relayer
      const gasToken = ZERO_ADDRESS; // ETH
      const txGasEstimate = 0;
      const baseGasEstimate = 0;
      const executor = ZERO_ADDRESS;
      const refundReceiver = ZERO_ADDRESS;

      // (r, s, v) where v is 1 means this signature is approved by the address encoded in value r
      // For a single user, we auto generate the signature without prompting the user
      const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
        { type: "uint256", value: account }, // r
        { type: "uint256", value: 0 }, // s
        { type: "uint8", value: 1 } // v
      );

      setLoadingTx(true);
      setTxHash("");
      setTxData("");

      try {
        // estimate using api
        const estimateResponse = await fetch(
          `${gnosisSafeTransactionV2Endpoint}${safeAddress}/transactions/estimate/`,
          {
            method: "POST",
            body: JSON.stringify({
              safe: safeAddress,
              to,
              value: valueWei,
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
        const { safeTxGas, baseGas, lastUsedNonce, exception } = estimateResult;
        if (exception) {
          throw new Error("Gas estimation error. The transaction might fail.");
        }
        const gasLimit = Number(safeTxGas) + Number(baseGas) + 21000; // giving a little higher gas limit just in case
        const nonce = lastUsedNonce === null ? 0 : lastUsedNonce + 1;
        if (!isMultiOwner) {
          if (isMetaEnabled) {
            let approvedSign;

            const contractTransactionHash =
              await proxyContract.getTransactionHash(
                to,
                valueWei,
                data,
                operation,
                0,
                baseGasEstimate,
                gasPrice,
                gasToken,
                executor,
                nonce
              );

            approvedSign = await getAppropriateSignature({
              to,
              value: valueWei,
              data,
              operation,
              safeTxGas: 0,
              baseGas: baseGasEstimate,
              gasPrice,
              gasToken,
              refundReceiver,
              nonce,
              contractTransactionHash,
            });

            setTxData({
              to: safeAddress,
              from: safeAddress,
              params: [
                to,
                valueWei,
                data,
                operation,
                txGasEstimate,
                baseGasEstimate,
                gasPrice,
                gasToken,
                executor,
                approvedSign,
              ],
              gasLimit,
            });
          } else {
            const tx = await proxyContract.execTransaction(
              to,
              valueWei,
              data,
              operation,
              txGasEstimate,
              baseGasEstimate,
              gasPrice,
              gasToken,
              executor,
              autoApprovedSignature,
              {
                gasLimit,
                gasPrice: averageGasPrice || DEFAULT_GAS_PRICE,
              }
            );
            setTxHash(tx.hash);

            await tx.wait();
          }
        } else {
          // Multiowner
          let approvedSign;

          const contractTransactionHash =
            await proxyContract.getTransactionHash(
              to,
              valueWei,
              data,
              operation,
              0,
              baseGasEstimate,
              gasPrice,
              gasToken,
              executor,
              multisigNonce
            );

          approvedSign = await getAppropriateSignature({
            to,
            value: valueWei,
            data,
            operation,
            safeTxGas: 0,
            baseGas: baseGasEstimate,
            gasPrice,
            gasToken,
            refundReceiver,
            nonce: multisigNonce,
            contractTransactionHash,
          });

          setTxData({
            // safe: safeAddress,
            to,
            value: String(valueWei),
            data,
            operation,
            gasToken,
            safeTxGas: 0,
            baseGas: baseGasEstimate,
            gasPrice: String(gasPrice),
            refundReceiver,
            nonce: multisigNonce,
            contractTransactionHash,
            sender: account,
            signature: approvedSign.replace("0x", ""),
            origin: null,
            transactionHash: null,
          });
        }
      } catch (err) {
        setLoadingTx(false);
        console.log(err.message);
      }
    }
  };

  return {
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
  };
}
