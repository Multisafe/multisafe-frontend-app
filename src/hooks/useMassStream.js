import { Framework } from "@superfluid-finance/sdk-core";
import ConstantFlowAgreementABI from "constants/abis/ConstantFlowAgreement.json";
import ERC20ABI from "constants/abis/ERC20.json";
import SuperfluidHostABI from "constants/abis/SuperfluidHost.json";
import SuperTokenABI from "constants/abis/SuperToken.json";
import { ethers } from "ethers";
import { useActiveWeb3React, useContract, useTransactionEffects } from "hooks";
import { useAddresses } from "hooks/useAddresses";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeSelectTokensDetails } from "store/tokens/selectors";
import { getAmountInWei } from "utils/tx-helpers";
import useBatchTransaction from "./useBatchTransactions";

/**
 *
 * for Superfluid Network related queries, refer:
 * https://docs.superfluid.finance/superfluid/protocol-developers/networks#test-networks
 *
 * */

let cacheMap = {},
  sf,
  CFA_ADDRESS,
  SF_HOST_ADDRESS;

const isWrappedToken = (token) => {
  if (Object.keys(token).includes("underlyingAddress")) return true;
  return false;
};

const getFlowRate = (tokenValue, duration) => {
  const periodicAmount = ethers.utils.parseEther((tokenValue || 0).toString());
  const flowRate = Math.floor(periodicAmount / duration?.value);

  return flowRate.toString();
};

export default function useMassStream() {
  const { ZERO_ADDRESS } = useAddresses();
  const { chainId, library } = useActiveWeb3React();
  const tokensDictionary = useSelector(makeSelectTokensDetails());

  useEffect(() => {
    async function initializeSFFramework() {
      sf = await Framework.create({
        provider: library,
        chainId,
      });

      const { hostAddress, cfaV1Address } = sf.cfaV1.options.config;
      CFA_ADDRESS = cfaV1Address;
      SF_HOST_ADDRESS = hostAddress;
    }

    initializeSFFramework();

    return () => {};
  }, [chainId, library]);

  const getWrappedTokenAddress = useCallback(
    (tokenDetails) => {
      let res;
      res = tokenDetails?.address.toLowerCase();
      // if tokenDetails obj contains underlying address,
      // its already a Wrapped Token
      if (tokenDetails?.underlyingAddress) return ethers.utils.getAddress(res);

      if (cacheMap[res]) return cacheMap[res];

      // TODO: handle MATIC or Default Network token case
      const foundAddress = Object.values(tokensDictionary).find(
        (i) => i?.meta?.underlyingAddress?.toLowerCase() === res
      )?.address;

      const checksummedAddress = ethers.utils.getAddress(foundAddress);

      cacheMap[res] = checksummedAddress;

      return checksummedAddress;
    },
    [tokensDictionary]
  );

  const [baseRequestBody, setBaseRequestBody] = useState();
  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransaction();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  // Superfluid Host contract
  const _SFHostContract = useContract(ZERO_ADDRESS, SuperfluidHostABI);

  // Super Token ERC777
  const _SuperTokenContract = useContract(ZERO_ADDRESS, SuperTokenABI);

  // Superfluid Constant Flow Agreement contract
  const _CFAContract = useContract(ZERO_ADDRESS, ConstantFlowAgreementABI);

  // Native token contract
  const _ERC20TokenContract = useContract(ZERO_ADDRESS, ERC20ABI);

  const buildFlowTxn = (receiver, tokenDetails) => {
    const cfaContract = _CFAContract.attach(CFA_ADDRESS);
    const sfHost = _SFHostContract.attach(SF_HOST_ADDRESS);
    const cfaFunctionEncodedData = cfaContract.interface.encodeFunctionData(
      "createFlow",
      [
        getWrappedTokenAddress(tokenDetails), // wrapped token address
        receiver.address, // receiver address
        getFlowRate(receiver.tokenValue, receiver.duration), // flow rate
        "0x", // custom data
      ]
    );

    return {
      // the culprit
      operation: 0,
      to: SF_HOST_ADDRESS,
      value: 0,
      data: sfHost.interface.encodeFunctionData("callAgreement", [
        CFA_ADDRESS,
        cfaFunctionEncodedData,
        "0x",
      ]),
    };
  };

  const batchStream = async ({ batch, allTokenDetails, baseRequestBody }) => {
    setBaseRequestBody(baseRequestBody);

    if (!allTokenDetails || !batch) return;

    let aggregateWrappedTokenValue = {};
    let aggregateNativeTokenValue = {};

    let approveTxnsList = [];
    let upgradeTxnsList = [];
    let transactionsList = [];

    // loop through all batches and build individual txns.
    for (let { receivers, token } of batch) {
      const tokenDetails = allTokenDetails.find(
        ({ name }) => name === token.value
      );

      let netSum = 0;
      receivers.forEach((receiver) => {
        netSum += parseFloat(receiver.tokenValue);

        // build individual "Create Flow" txn;
        transactionsList.push(buildFlowTxn(receiver, tokenDetails));
      });
      const isWRAPPED = isWrappedToken(tokenDetails);
      const erc20TokenAddress = isWRAPPED
        ? tokenDetails.underlyingAddress
        : tokenDetails.address;

      if (!isWRAPPED) {
        // amount of native value to approve
        aggregateNativeTokenValue[erc20TokenAddress] =
          (aggregateNativeTokenValue[erc20TokenAddress] || 0) + netSum;
      }

      const wrappedAddress = getWrappedTokenAddress(tokenDetails);

      // amount of wrapped value to upgrade
      aggregateWrappedTokenValue[wrappedAddress] =
        (aggregateWrappedTokenValue[wrappedAddress] || 0) + netSum;
    }

    // approve & upgrade tokens
    Object.entries(aggregateNativeTokenValue).forEach(
      ([nativeAddress, tokenValue]) => {
        const token = _ERC20TokenContract.attach(nativeAddress);
        const superTokenAddress = ethers.utils.getAddress(
          cacheMap[nativeAddress.toLowerCase()]
        );
        const sTokenContract = _SuperTokenContract.attach(superTokenAddress);

        // TODO: get decimals dynamically
        const tokenValueInWei = getAmountInWei(tokenValue, 18).toString();

        // TODO: check available token worth

        const approveTxn = {
          operation: 1,
          to: nativeAddress,
          value: 0,
          data: token.interface.encodeFunctionData("approve", [
            superTokenAddress,
            tokenValueInWei,
          ]),
          // message: `approving ${tokenValue} ${nativeAddress}`,
        };

        approveTxnsList.push(approveTxn);

        const upgradeTxn = {
          operation: 1,
          to: superTokenAddress,
          value: 0,
          data: sTokenContract.interface.encodeFunctionData("upgrade", [
            tokenValueInWei,
          ]),
          // message: `upgrading ${tokenValue} ${superTokenAddress}`,
        };

        upgradeTxnsList.push(upgradeTxn);
      }
    );

    const transactions = [
      ...approveTxnsList,
      ...upgradeTxnsList,
      ...transactionsList,
    ];

    console.log({
      allTokenDetails,
      batch,
      baseRequestBody,
    });

    console.log({
      transactions,
    });

    await executeBatchTransactions({
      transactions,
    });
  };

  return {
    batchStream,
    loadingTx,
    txData,
    txHash,
  };
}
