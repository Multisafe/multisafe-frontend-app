import { useState } from "react";
import { useSelector } from "react-redux";

import {
  useContract,
  useTransactionEffects,
  useBatchTransactions,
} from "hooks";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useAddresses } from "hooks/useAddresses";

export default function useManageOwners() {
  const { SENTINEL_ADDRESS } = useAddresses();

  const [baseRequestBody, setBaseRequestBody] = useState();
  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransactions();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  // contracts
  const proxyContract = useContract(safeAddress, GnosisSafeABI, true);

  const replaceSafeOwner = async ({
    oldOwner,
    newOwner,
    safeOwners,
    baseRequestBody,
  }) => {
    const transactions = [];

    setBaseRequestBody(baseRequestBody);

    // get prevOwner
    const oldOwnerIndex = safeOwners.findIndex((addr) => addr === oldOwner);

    if (oldOwnerIndex < 0) return;

    const prevOwnerAddress =
      oldOwnerIndex === 0 ? SENTINEL_ADDRESS : safeOwners[oldOwnerIndex - 1];

    transactions.push({
      operation: 0, // CALL
      to: proxyContract.address,
      value: 0,
      data: proxyContract.interface.encodeFunctionData("swapOwner", [
        prevOwnerAddress,
        oldOwner,
        newOwner,
      ]),
    });

    await executeBatchTransactions({ transactions });
  };

  const deleteSafeOwner = async ({
    owner,
    safeOwners,
    newThreshold,
    baseRequestBody,
  }) => {
    const transactions = [];

    setBaseRequestBody(baseRequestBody);

    // get prevOwner
    const oldOwnerIndex = safeOwners.findIndex((addr) => addr === owner);

    if (oldOwnerIndex < 0) return;

    const prevOwnerAddress =
      oldOwnerIndex === 0 ? SENTINEL_ADDRESS : safeOwners[oldOwnerIndex - 1];

    transactions.push({
      operation: 0, // CALL
      to: proxyContract.address,
      value: 0,
      data: proxyContract.interface.encodeFunctionData("removeOwner", [
        prevOwnerAddress,
        owner,
        newThreshold,
      ]),
    });

    await executeBatchTransactions({ transactions });
  };

  const addSafeOwner = async ({ owner, newThreshold, baseRequestBody }) => {
    const transactions = [];

    setBaseRequestBody(baseRequestBody);

    transactions.push({
      operation: 0, // CALL
      to: proxyContract.address,
      value: 0,
      data: proxyContract.interface.encodeFunctionData(
        "addOwnerWithThreshold",
        [owner, newThreshold]
      ),
    });

    await executeBatchTransactions({ transactions });
  };

  const changeThreshold = async ({ newThreshold, baseRequestBody }) => {
    const transactions = [];

    setBaseRequestBody(baseRequestBody);

    transactions.push({
      operation: 0, // CALL
      to: proxyContract.address,
      value: 0,
      data: proxyContract.interface.encodeFunctionData("changeThreshold", [
        newThreshold,
      ]),
    });

    await executeBatchTransactions({ transactions });
  };

  return {
    loadingTx,
    replaceSafeOwner,
    deleteSafeOwner,
    addSafeOwner,
    changeThreshold,
  };
}
