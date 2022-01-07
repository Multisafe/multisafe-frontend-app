import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import semverSatisfies from "semver/functions/satisfies";

import {
  useContract,
  useTransactionEffects,
  useBatchTransactions,
} from "hooks";
import { getAmountInWei } from "utils/tx-helpers";
import GnosisSafeABIBeforeV130 from "constants/abis/GnosisSafeBeforeV130.json";
import GnosisSafeABIAfterV130 from "constants/abis/GnosisSafe.json";
import AllowanceModuleABI from "constants/abis/AllowanceModule.json";
import {
  makeSelectOwnerSafeAddress,
  makeSelectSafeVersion,
} from "store/global/selectors";
import { useAddresses } from "hooks/useAddresses";

export default function useSpendingLimits() {
  const { ZERO_ADDRESS, ALLOWANCE_MODULE_ADDRESS } = useAddresses();

  const [baseRequestBody, setBaseRequestBody] = useState();
  const [proxyContract, setProxyContract] = useState();

  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransactions();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
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
  const allowanceModule = useContract(
    ALLOWANCE_MODULE_ADDRESS,
    AllowanceModuleABI,
    true
  );

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

  const createSpendingLimit = async ({
    delegate,
    tokenDetails,
    tokenAmount,
    resetTimeMin,
    baseRequestBody,
  }) => {
    const transactions = [];
    let isAllowanceModuleEnabled;

    setBaseRequestBody(baseRequestBody);

    try {
      // 1. enableModule
      const isVersionAfterV130 = semverSatisfies(safeVersion, ">=1.3.0");

      if (isVersionAfterV130) {
        isAllowanceModuleEnabled = await proxyContract.isModuleEnabled(
          ALLOWANCE_MODULE_ADDRESS
        );
      } else {
        const allModules = await proxyContract.getModules();

        isAllowanceModuleEnabled =
          allModules &&
          allModules.find((module) => module === ALLOWANCE_MODULE_ADDRESS)
            ? true
            : false;
      }
    } catch (err) {
      console.error(err);
      return;
    }

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
