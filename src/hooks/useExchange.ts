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
import ERC20ABI from "../constants/abis/ERC20.json";
import useActiveWeb3React from "./useActiveWeb3React";
import { TRANSACTION_MODES } from "../constants/transactions";
import { makeSelectSelectedGasPriceInWei } from "store/gas/selectors";

const paraSwap = new ParaSwap(networkId);

const DEFAULT_SLIPPAGE = 1;

export const useExchange = () => {
  const [proxyAddress, setProxyAddress] = useState<string>("");
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account } = useActiveWeb3React();

  const [baseRequestBody, setBaseRequestBody] = useState<Object>();
  const [error, setError] = useState<string>("");

  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransactions();
  useTransactionEffects({ txHash, txData, baseRequestBody });

  const erc20Contract = useContract(addresses.ZERO_ADDRESS, ERC20ABI, true);

  const selectedGasPrice = useSelector(makeSelectSelectedGasPriceInWei());

  const getProxyAddress = async () => {
    const proxyAddressResponse = await paraSwap.getTokenTransferProxy();
    if (typeof proxyAddressResponse === "string") {
      //check Address | APIError
      setProxyAddress(proxyAddressResponse);
    }
  };

  useEffect(() => {
    getProxyAddress();
  }, []);

  const getExchangeRate = async (
    payTokenAddress: string,
    receiveTokenAddress: string,
    amount: FixMe
  ) => {
    setError("");

    const rate = await paraSwap.getRate(
      payTokenAddress,
      receiveTokenAddress,
      String(amount),
      safeAddress
    );

    if ("message" in rate) {
      console.log(rate.message);
      setError(rate.message);
      return;
    }

    return rate;
  };

  const approveAndSwap = async (
    payTokenAddress: string,
    receiveTokenAddress: string,
    amount: FixMe,
    slippage: number = DEFAULT_SLIPPAGE,
    baseRequestBody: FixMe
  ) => {
    setError("");

    if (!erc20Contract || !proxyAddress) {
      throw new Error("Contract or proxy address not initiated");
    }

    const contract = erc20Contract.attach(payTokenAddress);

    setBaseRequestBody({
      safeAddress,
      createdBy: account,
      to: proxyAddress,
      transactionMode: TRANSACTION_MODES.APPROVE_AND_SWAP,
      ...baseRequestBody,
    });

    const rate = await getExchangeRate(
      getAddress(payTokenAddress),
      getAddress(receiveTokenAddress),
      amount
    );

    if (!rate) {
      return;
    }

    console.log(rate);

    const { srcToken, destToken, srcAmount, destAmount } = rate;

    const minAmount = new BigNumber(destAmount)
      .times(1 - slippage / 100)
      .toFixed(0);
    console.log(minAmount);

    const txParams = await paraSwap.buildTx(
      srcToken,
      destToken,
      srcAmount,
      minAmount,
      rate,
      safeAddress,
      undefined,
      undefined,
      undefined,
      safeAddress,
      {
        ignoreChecks: true,
        // gasPrice: selectedGasPrice
      }
    );

    if ("message" in txParams) {
      console.log(txParams.message);
      setError(txParams.message);
      return;
    }

    console.log(txParams);

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
    paraSwap,
    error,
    getExchangeRate,
    approveAndSwap,
  };
};
