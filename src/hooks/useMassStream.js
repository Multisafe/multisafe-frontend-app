import ConstantFlowAgreementABI from "constants/abis/ConstantFlowAgreement.json";
import SuperfluidHostABI from "constants/abis/SuperfluidHost.json";
import SuperTokenABI from "constants/abis/SuperToken.json";
import { ethers } from "ethers";
import {
  useActiveWeb3React,
  useBatchTransactions,
  useContract,
  useTransactionEffects,
} from "hooks";
import { useAddresses } from "hooks/useAddresses";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectTokensDetails } from "store/tokens/selectors";
import { getAmountInWei } from "utils/tx-helpers";

let cacheMap = {};

const RINKEBY_TOKEN_DETAILS = {
  "0x745861aed1eee363b4aaa5f1994be40b1e05ff90": {
    id: "4_0x745861aed1eee363b4aaa5f1994be40b1e05ff90",
    address: "0x745861aed1eee363b4aaa5f1994be40b1e05ff90",
    createdAt: "2022-02-04T13:29:53.230Z",
    isActive: true,
    name: "Super fDAI Fake Token",
    networkId: 4,
    symbol: "fDAIx",
    underlyingAddress: "0x15f0ca26781c3852f8166ed2ebce5d18265cceb7",
    updatedAt: "2022-02-06T08:58:56.185Z",
  },
  "0x15f0ca26781c3852f8166ed2ebce5d18265cceb7": {
    id: "4_0x15f0ca26781c3852f8166ed2ebce5d18265cceb7",
    address: "0x15f0ca26781c3852f8166ed2ebce5d18265cceb7",
    createdAt: "2022-02-04T13:29:53.230Z",
    isActive: true,
    name: "fDAI Fake Token",
    networkId: 4,
    symbol: "fDAI",
    updatedAt: "2022-02-06T08:58:56.185Z",
  },
};

const getFlowRate = (tokenValue, duration) => {
  const periodicAmount = ethers.utils.parseEther((tokenValue || 0).toString());
  const flowRate = Math.floor(periodicAmount / duration?.value);

  return flowRate.toString();
};

// https://docs.superfluid.finance/superfluid/protocol-developers/networks#test-networks

// Polygon MATIC
// const CFA_ADDRESS = "0x6EeE6060f715257b970700bc2656De21dEdF074C";
// const SF_HOST_ADDRESS = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";

// Rinkeby
const CFA_ADDRESS = "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A";
const SF_HOST_ADDRESS = "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6";

export default function useMassStream() {
  const { ZERO_ADDRESS } = useAddresses();
  const { chainId } = useActiveWeb3React();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const tokensDictionary = useSelector(makeSelectTokensDetails());

  const getWrappedTokenAddress = useCallback(
    (tokenDetails, shouldLog) => {
      // return "0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0";
      const address = tokenDetails?.address.toLowerCase();
      // if tokenDetails obj contains underlying address, its already a Wrapped Token
      if (tokenDetails?.underlyingAddress) return address;

      if (cacheMap[address]) return cacheMap[address];

      // TODO: handle MATIC or Default Network token case
      const foundAddress = Object.values(tokensDictionary).find(
        (i) => i?.meta?.underlyingAddress?.toLowerCase() === address
      )?.address;

      cacheMap[address] = foundAddress;

      return foundAddress;
    },
    [tokensDictionary]
  );

  const [baseRequestBody, setBaseRequestBody] = useState();
  const { executeBatchTransactions, loadingTx, txHash, txData } =
    useBatchTransactions();

  useTransactionEffects({ txHash, txData, baseRequestBody });

  // Superfluid Host contract
  const _SFHostContract = useContract(ZERO_ADDRESS, SuperfluidHostABI);
  // Super Token ERC777
  const _SuperTokenContract = useContract(ZERO_ADDRESS, SuperTokenABI);
  // Superfluid Constant Flow Agreement contract
  const _CFAContract = useContract(ZERO_ADDRESS, ConstantFlowAgreementABI);

  const cfaContract = _CFAContract.attach(CFA_ADDRESS);
  const sfHost = _SFHostContract.attach(SF_HOST_ADDRESS);

  const buildFlowTxn = (receiver, tokenDetails) => {
    const cfaFunctionEncodedData = cfaContract.interface.encodeFunctionData(
      "createFlow",
      [
        getWrappedTokenAddress(tokenDetails),
        receiver.address,
        getFlowRate(receiver.tokenValue, receiver.duration),
        "0x",
      ]
    );

    return {
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

    let requiredNettWrappedTokenValue = {};

    let transactions = [];

    // loop through all batches and build individual txns.
    for (let { receivers, token } of batch) {
      const tokenDetails = allTokenDetails.find(
        ({ name }) => name === token.value
      );

      let netSum = 0;
      receivers.forEach((receiver) => {
        netSum += Number(receiver.tokenValue);

        // build individual "Create Flow" txn;
        transactions.push(buildFlowTxn(receiver, tokenDetails));
      });

      // calculate total required token value
      const wrappedAddress = getWrappedTokenAddress(tokenDetails, true);

      requiredNettWrappedTokenValue[wrappedAddress] =
        (requiredNettWrappedTokenValue[wrappedAddress] || 0) + netSum;
    }

    console.log({ requiredNettWrappedTokenValue });

    Object.entries(requiredNettWrappedTokenValue).forEach(([key, value]) => {
      const sTokenContract = _SuperTokenContract.attach(key);
      // TODO: check available token worth

      const txn = {
        operation: 0,
        to: key,
        value: 0,
        data: sTokenContract.interface.encodeFunctionData("upgrade", [
          // TODO: get decimals dynamically
          getAmountInWei(value, 18).toString(),
        ]),
      };

      transactions.unshift(txn);
    });

    console.log({ transactions, allTokenDetails, batch, baseRequestBody });

    await executeBatchTransactions({ transactions });
  };

  return {
    batchStream,
    loadingTx,
    txData,
    txHash,
  };
}
