/*
 * useMassPayout hook
 * the massPayout function takes two params:
 * an array of objects, `recievers` with the keys:
 * address, salaryToken("DAI"/"USDC" etc), salaryAmount(in ETH, "10"/"500" etc.)
 * and the token to pay them from ("DAI"/"USDC" etc)
 * [{address: String, salaryToken: String, salaryAmount: String}]
 */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { arrayify } from "@ethersproject/bytes";
import { addDays, format } from "date-fns";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";
// import { LedgerConnector } from "@web3-react/ledger-connector";
// import { TrezorConnector } from "@web3-react/trezor-connector";
// import { InjectedConnector } from "@web3-react/injected-connector";

import { useActiveWeb3React, useContract } from "hooks";
import {
  joinHexData,
  getHexDataLength,
  standardizeTransaction,
  getAmountInWei,
} from "utils/tx-helpers";
import addresses from "constants/addresses";
import { DEFAULT_GAS_PRICE, tokens } from "constants/index";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ERC20ABI from "constants/abis/ERC20.json";
import MultiSendABI from "constants/abis/MultiSend.json";
import UniswapABI from "constants/abis/Uniswap.json";
import AllowanceModuleABI from "constants/abis/AllowanceModule.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getGasPrice } from "store/gas/actions";
import gasPriceSaga from "store/gas/saga";
import gasPriceReducer from "store/gas/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import { getConfigByTokenNames } from "utils/massPayout";
import { gnosisSafeTransactionV2Endpoint } from "constants/endpoints";

const gasPriceKey = "gas";

const {
  DAI_ADDRESS,
  MULTISEND_ADDRESS,
  ZERO_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  UNISWAP_ROUTER_ADDRESS,
  ALLOWANCE_MODULE_ADDRESS,
} = addresses;

export default function useMassPayout(props = {}) {
  const { tokenDetails } = props;
  const { account, library, connector } = useActiveWeb3React();

  const [loadingTx, setLoadingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txData, setTxData] = useState("");
  const [confirmTxData, setConfirmTxData] = useState("");
  const [recievers, setRecievers] = useState();
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [isHardwareWallet, setIsHardwareWallet] = useState(false);

  useInjectReducer({ key: gasPriceKey, reducer: gasPriceReducer });

  useInjectSaga({ key: gasPriceKey, saga: gasPriceSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());

  // contracts
  const proxyContract = useContract(ownerSafeAddress, GnosisSafeABI, true);
  const allowanceModule = useContract(
    ALLOWANCE_MODULE_ADDRESS,
    AllowanceModuleABI,
    true
  );

  const [tokenFrom, setTokenFrom] = useState(tokens.DAI); // eslint-disable-line
  const dai = useContract(DAI_ADDRESS, ERC20ABI, true);
  const customToken = useContract(ZERO_ADDRESS, ERC20ABI, true);
  // const erc20 = useContract(tokenNameToAddress[tokenFrom], ERC20ABI, true);
  const usdc = useContract(USDC_ADDRESS, ERC20ABI, true); // eslint-disable-line
  const usdt = useContract(USDT_ADDRESS, ERC20ABI, true); // eslint-disable-line
  const multiSend = useContract(MULTISEND_ADDRESS, MultiSendABI);
  const uniswapRouter = useContract(UNISWAP_ROUTER_ADDRESS, UniswapABI);

  useEffect(() => {
    if (!averageGasPrice)
      // get gas prices
      dispatch(getGasPrice());
  }, [dispatch, averageGasPrice]);

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

  const getERC20ContractByName = (name) => {
    switch (name) {
      case tokens.DAI:
        return dai;
      case tokens.USDC:
        return usdc;
      case tokens.USDT:
        return usdt;
      default:
        return dai;
    }
  };

  const getERC20Contract = (contractAddress) => {
    if (contractAddress) return customToken.attach(contractAddress);
    return customToken;
  };

  // if the tokens are different, add two transactions:
  // 1. approve uniswap router to spend the token (eg DAI)
  // 2. swap the input token for the output token using uniswap
  // TODO: revisit this for swapping from custom token
  const getUniswapTransactions = (
    tokenTo,
    tokenAmount,
    toAddress,
    tokenFrom,
    inputTokenDetails
  ) => {
    // TODO: come up with a better solution for max amount in
    // should calculate max amount needed for the swap from uniswap
    const amountIn = parseEther(String(Number.MAX_SAFE_INTEGER));

    const amountOut = getAmountInWei(tokenAmount, inputTokenDetails.decimals);

    const { functionName, path } = getConfigByTokenNames(tokenTo, tokenFrom);
    const erc20 = getERC20ContractByName(tokenFrom);
    if (!functionName || !path.length) return [];

    const uniswapData = uniswapRouter.interface.encodeFunctionData(
      functionName,
      [
        amountOut,
        amountIn,
        path,
        toAddress,
        format(addDays(Date.now(), 1), "t"),
      ]
    );

    return [
      {
        operation: 0, // CALL
        to: erc20.address,
        value: 0,
        data: erc20.interface.encodeFunctionData("approve", [
          UNISWAP_ROUTER_ADDRESS,
          amountIn,
        ]),
      },
      {
        operation: 0, // CALL
        to: UNISWAP_ROUTER_ADDRESS,
        value: 0,
        data: uniswapData,
      },
    ];
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
      verifyingContract: ownerSafeAddress,
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
          connector === "MetaMask" &&
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

  const executeBatchTransactions = async ({
    transactions,
    isMultiOwner,
    createNonce,
    isMetaEnabled,
  }) => {
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

      try {
        setLoadingTx(true);
        setTxHash("");
        setTxData("");

        try {
          // estimate using api
          const estimateResponse = await fetch(
            `${gnosisSafeTransactionV2Endpoint}${ownerSafeAddress}/transactions/estimate/`,
            {
              method: "POST",
              body: JSON.stringify({
                safe: ownerSafeAddress,
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
          const { safeTxGas, baseGas, lastUsedNonce } = estimateResult;
          const gasLimit = Number(safeTxGas) + Number(baseGas) + 21000; // giving a little higher gas limit just in case
          const nonce = lastUsedNonce === null ? 0 : lastUsedNonce + 1;
          if (!isMultiOwner) {
            if (isMetaEnabled) {
              let approvedSign;

              const contractTransactionHash = await proxyContract.getTransactionHash(
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

              if (isHardwareWallet) {
                approvedSign = await ethSigner(
                  account,
                  contractTransactionHash
                );
              } else {
                approvedSign = await eip712Signer(
                  to,
                  valueWei,
                  data,
                  operation,
                  0, // set gasLimit as 0 for sign
                  baseGasEstimate,
                  gasPrice,
                  gasToken,
                  refundReceiver,
                  nonce,
                  contractTransactionHash
                );
              }

              setTxData({
                to: ownerSafeAddress,
                from: ownerSafeAddress,
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

            const contractTransactionHash = await proxyContract.getTransactionHash(
              to,
              valueWei,
              data,
              operation,
              0,
              baseGasEstimate,
              gasPrice,
              gasToken,
              executor,
              createNonce
            );

            if (isHardwareWallet) {
              approvedSign = await ethSigner(account, contractTransactionHash);
            } else {
              // Create new tx
              approvedSign = await eip712Signer(
                to,
                valueWei,
                data,
                operation,
                0, // set gasLimit as 0 for sign
                baseGasEstimate,
                gasPrice,
                gasToken,
                refundReceiver,
                createNonce,
                contractTransactionHash
              );
            }

            setTxData({
              // safe: ownerSafeAddress,
              to,
              value: String(valueWei),
              data,
              operation,
              gasToken,
              safeTxGas: 0,
              baseGas: baseGasEstimate,
              gasPrice: String(gasPrice),
              refundReceiver,
              nonce: createNonce,
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
      } catch (err) {
        setLoadingTx(false);
        console.error(err);
      }
    }
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

          const contractTransactionHash = await proxyContract.getTransactionHash(
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
          const {
            safeTxGas: finalSafeTxGas,
            baseGas: finalBaseGas,
          } = estimateResult;
          const gasLimit =
            Number(finalSafeTxGas) + Number(finalBaseGas) + 21000; // giving a little higher gas limit just in case

          const contractTransactionHash = await proxyContract.getTransactionHash(
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

            const confirmingAccounts = isApproved
              ? [
                  { owner: account, signature: approvedSign },
                  ...confirmations.map(
                    ({ owner, signature, approved }) =>
                      approved && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean)
              : [
                  { owner: account, signature: approvedSign },
                  ...confirmations.map(
                    ({ owner, signature, rejected }) =>
                      rejected && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean);

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
                  { owner: account, signature: autoApprovedSignature },
                  ...confirmations.map(
                    ({ owner, signature, approved }) =>
                      approved && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean)
              : [
                  { owner: account, signature: autoApprovedSignature },
                  ...confirmations.map(
                    ({ owner, signature, rejected }) =>
                      rejected && {
                        owner,
                        signature,
                      }
                  ),
                ].filter(Boolean);
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
        }
      } catch (err) {
        setLoadingTx(false);
        console.error(err);
      }
    }
  };

  const massPayout = async (
    recievers,
    tokenFrom,
    isMultiOwner = false,
    createNonce,
    isMetaEnabled = false
  ) => {
    setRecievers(recievers);
    setTokenFrom(tokenFrom);
    if (!tokenDetails) return;

    const erc20 = getERC20Contract(tokenDetails.address);

    // If input and output tokens are different, swap using uniswap
    // If input and output tokens are same, simply call transfer
    const transactions = recievers.reduce(
      (tx, { address, salaryToken, salaryAmount }) => {
        if (salaryToken !== tokenFrom) {
          tx.push(
            ...getUniswapTransactions(
              salaryToken,
              salaryAmount,
              address,
              tokenFrom,
              tokenDetails
            )
          );
          return tx;
        }

        const transferAmount = getAmountInWei(
          salaryAmount,
          tokenDetails.decimals
        );

        // ETH
        if (salaryToken === tokens.ETH) {
          tx.push({
            operation: 0, // CALL
            data: "0x",
            to: address,
            value: transferAmount,
          });
          return tx;
        }

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

    await executeBatchTransactions({
      transactions,
      isMultiOwner,
      createNonce,
      isMetaEnabled,
    });
  };

  const createSpendingLimit = async (
    delegate,
    tokenAmount,
    resetTimeMin,
    isMultiOwner,
    createNonce,
    isMetaEnabled
  ) => {
    const transactions = [];

    // 1. enableModule
    const allModules = await proxyContract.getModules();

    const isAllowanceModuleEnabled =
      allModules &&
      allModules.find((module) => module === ALLOWANCE_MODULE_ADDRESS)
        ? true
        : false;

    if (!isAllowanceModuleEnabled) {
      transactions.push({
        operation: 0, // CALL
        to: proxyContract.address,
        value: 0,
        data: proxyContract.interface.encodeFunctionData("enableModule", [
          ALLOWANCE_MODULE_ADDRESS,
        ]),
      });
    }

    const transferAmount = getAmountInWei(tokenAmount, tokenDetails.decimals);

    // 2. addDelegate
    // 3. setAllowance
    transactions.push(
      {
        operation: 0, // CALL
        to: allowanceModule.address,
        value: 0,
        data: allowanceModule.interface.encodeFunctionData("addDelegate", [
          delegate,
        ]),
      },
      {
        operation: 0, // CALL
        to: allowanceModule.address,
        value: 0,
        data: allowanceModule.interface.encodeFunctionData("setAllowance", [
          delegate,
          tokenDetails.address || ZERO_ADDRESS,
          transferAmount,
          resetTimeMin,
          0, // resetBaseMin
        ]),
      }
    );

    await executeBatchTransactions({
      transactions,
      isMultiOwner,
      createNonce,
      isMetaEnabled,
    });
  };

  return {
    loadingTx,
    txHash,
    recievers,
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
    createSpendingLimit,
  };
}
