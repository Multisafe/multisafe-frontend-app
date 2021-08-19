import { useState } from "react";
import { useSelector } from "react-redux";

import {
  useContract,
  useTransactionEffects,
  useBatchTransactions,
} from "hooks";
import { getAmountInWei } from "utils/tx-helpers";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import AllowanceModuleABI from "constants/abis/AllowanceModule.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

const { ZERO_ADDRESS, ALLOWANCE_MODULE_ADDRESS } = addresses;

export default function useSpendingLimits() {
  const [baseRequestBody, setBaseRequestBody] = useState();
  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransactions();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  // contracts
  const proxyContract = useContract(safeAddress, GnosisSafeABI, true);
  const allowanceModule = useContract(
    ALLOWANCE_MODULE_ADDRESS,
    AllowanceModuleABI,
    true
  );

  const createSpendingLimit = async ({
    delegate,
    tokenDetails,
    tokenAmount,
    resetTimeMin,
    baseRequestBody,
  }) => {
    const transactions = [];

    setBaseRequestBody(baseRequestBody);

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

    await executeBatchTransactions({ transactions });
  };

  return {
    loadingTx,
    createSpendingLimit,
  };
}
