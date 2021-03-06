import { useState, useEffect } from "react";
import { ParaSwap } from "paraswap";
import { BigNumber } from "bignumber.js";
import { getAddress } from "@ethersproject/address";
import { networkId } from "constants/networks";
import addresses from "constants/addresses";
import { useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import {
  useBatchTransactions,
  useContract,
  useTransactionEffects,
} from "./index";
import ERC20ABI from "constants/abis/ERC20.json";
import useActiveWeb3React from "./useActiveWeb3React";
import { TRANSACTION_MODES } from "../constants/transactions";

const paraSwap = new ParaSwap(networkId);

export const useExchange = () => {
  const [proxyAddress, setProxyAddress] = useState<string>("");
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account } = useActiveWeb3React();

  const [baseRequestBody, setBaseRequestBody] = useState<Object>();
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [error, setError] = useState<string>("");

  const { executeBatchTransactions, txHash, txData, loadingTx } =
    useBatchTransactions();
  useTransactionEffects({ txHash, txData, baseRequestBody });

  const erc20Contract = useContract(addresses.ZERO_ADDRESS, ERC20ABI, true);

  const getProxyAddress = async () => {
    try {
      const proxyAddressResponse = await paraSwap.getTokenTransferProxy();
      if (typeof proxyAddressResponse === "string") {
        //check Address | APIError
        setProxyAddress(proxyAddressResponse);
      } else {
        setError("Error fetching proxy address");
      }
    } catch (e) {
      setError("Error fetching proxy address");
    }
  };

  useEffect(() => {
    getProxyAddress();
  }, []);

  const getExchangeRate = async (
    payTokenAddress: string,
    payTokenDeciamls: number,
    receiveTokenAddress: string,
    receiveTokenDecimals: number,
    amount: FixMe
  ) => {
    setError("");

    const rate = await paraSwap.getRate(
      payTokenAddress,
      receiveTokenAddress,
      String(amount),
      safeAddress,
      undefined,
      undefined,
      payTokenDeciamls,
      receiveTokenDecimals
    );

    if ("message" in rate) {
      setError(rate.message);
      return;
    }

    return rate;
  };

  const approveAndSwap = async (
    payTokenAddress: string,
    payTokenDeciamls: number,
    receiveTokenAddress: string,
    receiveTokenDecimals: number,
    amount: FixMe,
    slippage: number,
    baseRequestBody: FixMe
  ) => {
    setError("");
    setLoadingSwap(true);

    if (!erc20Contract || !proxyAddress) {
      setLoadingSwap(false);
      setError("ParaSwap Proxy initiating error");
      return;
    }

    const contract = erc20Contract.attach(payTokenAddress);

    const rate = await getExchangeRate(
      getAddress(payTokenAddress),
      payTokenDeciamls,
      getAddress(receiveTokenAddress),
      receiveTokenDecimals,
      amount
    );

    if (!rate) {
      setLoadingSwap(false);
      setError("Error getting swap rate");
      return;
    }

    setBaseRequestBody({
      safeAddress,
      createdBy: account,
      to: proxyAddress,
      transactionMode: TRANSACTION_MODES.APPROVE_AND_SWAP,
      ...baseRequestBody,
      fiatValue: Number(rate.srcUSD),
      metaData: {
        ...(baseRequestBody?.metaData || {}),
        rate,
      },
    });

    const { srcToken, destToken, srcAmount, destAmount } = rate;

    const minAmount = new BigNumber(destAmount)
      .times(1 - slippage / 100)
      .toFixed(0);

    const txParams = await paraSwap.buildTx(
      srcToken,
      destToken,
      srcAmount,
      minAmount,
      rate,
      safeAddress,
      undefined,
      addresses.COINSHIFT_FEE_ADDRESS,
      undefined,
      safeAddress,
      {
        ignoreChecks: true,
      }
    );
    setLoadingSwap(false);

    if ("message" in txParams) {
      setError(txParams.message);
      return;
    }

    const transactions = [
      {
        operation: 0, // CALL
        to: contract.address,
        value: 0,
        data: contract.interface.encodeFunctionData("approve", [
          proxyAddress,
          amount,
        ]),
      },
      {
        operation: 0, // CALL
        to: txParams.to,
        value: txParams.value,
        data: txParams.data,
      },
    ];

    executeBatchTransactions({ transactions });
  };

  return {
    loadingTx,
    loadingSwap,
    paraSwap,
    error,
    getExchangeRate,
    approveAndSwap,
  };
};
