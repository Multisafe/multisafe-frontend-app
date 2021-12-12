import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { arrayify } from "@ethersproject/bytes";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";
import semverSatisfies from "semver/functions/satisfies";

import { useActiveWeb3React, useContract } from "hooks";
import {
  joinHexData,
  getHexDataLength,
  standardizeTransaction,
} from "utils/tx-helpers";
import { DEFAULT_GAS_PRICE } from "constants/index";
import GnosisSafeABIBeforeV130 from "constants/abis/GnosisSafeBeforeV130.json";
import GnosisSafeABIAfterV130 from "constants/abis/GnosisSafe.json";
import MultiSendABI from "constants/abis/MultiSend.json";
import {
  makeSelectOwnerSafeAddress,
  makeSelectIsMultiOwner,
  makeSelectSafeVersion,
} from "store/global/selectors";
import { makeSelectSelectedGasPriceInWei } from "store/gas/selectors";
import {GNOSIS_SAFE_TRANSACTION_ENDPOINTS, GNOSIS_SAFE_TRANSACTION_V2_ENDPOINTS} from "constants/endpoints";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import { makeSelectNonce } from "store/safe/selectors";
import { useAddresses } from "hooks/useAddresses";
import { CHAIN_IDS, NETWORK_NAMES } from "constants/networks";

export default function useBatchTransaction() {
  const { account, library, connector, chainId } = useActiveWeb3React();
  const { MULTISEND_ADDRESS, ZERO_ADDRESS } = useAddresses();

  const [loadingTx, setLoadingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txData, setTxData] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [isHardwareWallet, setIsHardwareWallet] = useState(false);
  const [proxyContract, setProxyContract] = useState();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const selectedGasPrice = useSelector(makeSelectSelectedGasPriceInWei());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const multisigNonce = useSelector(makeSelectNonce());
  const safeVersion = useSelector(makeSelectSafeVersion());

  // contracts
  const proxyContractBeforeV130 = useContract(
    safeAddress,
    GnosisSafeABIBeforeV130,
    true
  );
  const proxyContractAfterV130 = useContract(
    safeAddress,
    GnosisSafeABIAfterV130,
    true
  );
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

  useEffect(() => {
    function setContractVersion() {
      const isVersionAfterV130 = semverSatisfies(safeVersion, ">=1.3.0");

      if (isVersionAfterV130) {
        setProxyContract(proxyContractAfterV130);
      } else {
        setProxyContract(proxyContractBeforeV130);
      }
    }

    if (safeVersion) setContractVersion();
  }, [proxyContractBeforeV130, proxyContractAfterV130, safeVersion]);

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

  // This function returns the types structure for signing offchain messages
  // following EIP712
  const getEip712MessageTypes = (safeVersion) => {
    const EIP712_DOMAIN_BEFORE_V130 = [
      {
        type: "address",
        name: "verifyingContract",
      },
    ];

    const EIP712_DOMAIN = [
      {
        type: "uint256",
        name: "chainId",
      },
      {
        type: "address",
        name: "verifyingContract",
      },
    ];

    const eip712WithChainId = semverSatisfies(safeVersion, ">=1.3.0");

    return {
      EIP712Domain: eip712WithChainId
        ? EIP712_DOMAIN
        : EIP712_DOMAIN_BEFORE_V130,
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
    const eip712WithChainId = semverSatisfies(safeVersion, ">=1.3.0");

    const domain = {
      verifyingContract: safeAddress,
      chainId: eip712WithChainId ? chainId : undefined,
    };

    const types = getEip712MessageTypes(safeVersion);

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
          (err.code === -32603 ||
            err.message.includes(
              "Only version 4 of typed data signing is supported"
            ))
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

  const estimateGasSafeRelay = async (
    to,
    valueWei,
    data,
    operation,
    gasToken
  ) => {
    const estimateResponse = await fetch(
      `${GNOSIS_SAFE_TRANSACTION_V2_ENDPOINTS[chainId]}${safeAddress}/transactions/estimate/`,
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

    if (estimateResult.exception) {
      throw new Error("Gas estimation error. The transaction might fail.");
    }

    return estimateResult;
  };

  const estimateGasTransactionService = async (to, valueWei, data, operation) => {
    const baseGas = 100000;
    const lastUsedNonce = null;

    const estimateResponse = await fetch(
      `${GNOSIS_SAFE_TRANSACTION_ENDPOINTS[chainId]}${safeAddress}/multisig-transactions/estimations/`,
      {
        method: "POST",
        body: JSON.stringify({
          safe: safeAddress,
          to,
          value: valueWei,
          data,
          operation
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const {safeTxGas} = await estimateResponse.json();

    return { safeTxGas, baseGas, lastUsedNonce };
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
        const useSafeRelayForEstimation =
          chainId === CHAIN_IDS[NETWORK_NAMES.MAINNET] ||
          chainId === CHAIN_IDS[NETWORK_NAMES.RINKEBY];

        const { safeTxGas, baseGas, lastUsedNonce } = useSafeRelayForEstimation
          ? await estimateGasSafeRelay(to, valueWei, data, operation, gasToken)
          : await estimateGasTransactionService(to, valueWei, data, operation);

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
                gasPrice: selectedGasPrice || DEFAULT_GAS_PRICE,
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
