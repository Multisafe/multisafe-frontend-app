import { wad4human } from "@decentral.ee/web3-helpers";
import SF from "@superfluid-finance/js-sdk";
import { Framework } from "@superfluid-finance/sdk-core";
import ConstantFlowAgreement from "constants/abis/ConstantFlowAgreement.json";
import SuperTokenABI from "constants/abis/SuperToken.json";
import SuperfluidHost from "constants/abis/SuperfluidHost.json";
import { useActiveWeb3React, useContract } from "hooks";
import { useAddresses } from "hooks/useAddresses";
import useBatchTransaction from "hooks/useBatchTransactions";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getAmountInWei } from "utils/tx-helpers";
import { ethers } from "ethers";

let sf, dai, daix, matic, maticx, app;

// https://docs.superfluid.finance/superfluid/protocol-developers/networks#test-networks
// Polygon MATIC
// let CFA_ADDRESS;
// let SF_HOST_ADDRESS;

let CFA_ADDRESS = "0x6EeE6060f715257b970700bc2656De21dEdF074C";
let SF_HOST_ADDRESS = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";

// Rinkeby
// const CFA_ADDRESS = "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A";
// const SF_HOST_ADDRESS = "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6";

const RECEIVER_ADDRESS = "0xa78a6CFDe1c40f9fBdaa1a3DD6ac9AeD0bBe3A84";

let pollBalancesInterval;

export default function StreamUITrial() {
  const { library, account, chainId } = useActiveWeb3React();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const [approvalValue, setApprovalValue] = useState(0.01);
  const [receiverDetails, setReceiverDetails] = useState({});

  const [assets, setAssets] = useState({
    // daiBalance: 0,
    // daixBalance: 0,
    // allowedDAI: 0,
  });

  const fetchBalances = useCallback(async () => {
    // console.log(" --- Fetching balances");
    if (ownerSafeAddress) {
      const daiBalance = await dai.balanceOf(ownerSafeAddress);
      const daixBalance = await daix.balanceOf(ownerSafeAddress);
      const allowedDAI = await dai.allowance(ownerSafeAddress, daix.address);

      const daiBalance_receiver = await dai.balanceOf(RECEIVER_ADDRESS);
      const daixBalance_receiver = await daix.balanceOf(RECEIVER_ADDRESS);
      const allowedDAI_receiver = await dai.allowance(
        RECEIVER_ADDRESS,
        daix.address
      );

      const maticBalance_receiver = await matic.balanceOf(RECEIVER_ADDRESS);
      const maticXBalance_receiver = await maticx.balanceOf(RECEIVER_ADDRESS);

      const maticBalance_sender = await matic.balanceOf(ownerSafeAddress);
      const maticXBalance_sender = await maticx.balanceOf(ownerSafeAddress);

      const accountAllowedMatic = await matic.allowance(
        account,
        maticx.address
      );

      setAssets({
        daiBalance: wad4human(daiBalance),
        daixBalance: wad4human(daixBalance),
        allowedDAI: wad4human(allowedDAI),

        daiBalance_receiver: wad4human(daiBalance_receiver),
        daixBalance_receiver: wad4human(daixBalance_receiver),
        allowedDAI_receiver: wad4human(allowedDAI_receiver),
      });
    }

    // const sender = sf.user({
    //   address: ownerSafeAddress,
    //   token: daix.address,
    // });
    // const receiver = sf.user({
    //   address: RECEIVER_ADDRESS,
    //   token: daix.address,
    // });

    const sender = sf.user({
      address: ownerSafeAddress,
      token: daix.address,
    });
    // const receiver = sf.user({
    //   address: RECEIVER_ADDRESS,
    //   token: daix.address,
    // });

    setReceiverDetails({
      // receiver: {
      //   address: RECEIVER_ADDRESS,
      //   ...(await receiver.details()),
      // },
      sender: {
        address: ownerSafeAddress,
        ...(await sender.details()),
      },
    });

    // console.log(" --- Fetched balances");
  }, [ownerSafeAddress, account]);

  const logSFDetails = useCallback(async () => {
    sf = new SF.Framework({
      ethers: library,
      tokens: ["DAI", "MATIC"],
    });
    await sf.initialize();

    dai = sf.tokens.DAI;
    daix = sf.tokens.DAIx;

    matic = sf.tokens.WMATIC;
    maticx = sf.tokens.MATICx;

    console.log({ sf, dai, daix, matic, maticx });

    pollBalancesInterval = setInterval(fetchBalances, 10000);
    // fetchBalances();
  }, [fetchBalances, library]);

  const { executeBatchTransactions } = useBatchTransaction();

  const logSFFrameworkNew = useCallback(async () => {
    const sfNEW = await Framework.create({
      provider: library,
      chainId,
    });

    const { hostAddress, cfaV1Address } = sfNEW.cfaV1.options.config;
    CFA_ADDRESS = cfaV1Address;
    SF_HOST_ADDRESS = hostAddress;

    // queryStreamData();
  }, [library, chainId]);

  useEffect(() => {
    if (account && ownerSafeAddress) {
      logSFDetails();
      logSFFrameworkNew();
    }
    // }, [account, ownerSafeAddress, logSFFrameworkNew]);
  }, [account, ownerSafeAddress, logSFDetails, logSFFrameworkNew]);

  useEffect(() => {
    return () => {
      clearInterval(pollBalancesInterval);
    };
  }, []);

  const value = (val) => getAmountInWei(val, 18).toString();

  const addresses = useAddresses();
  const _sTokenContract = useContract(addresses.ZERO_ADDRESS, SuperTokenABI);
  const _cfaContract = useContract(
    addresses.ZERO_ADDRESS,
    ConstantFlowAgreement
  );
  const _sfHost = useContract(addresses.ZERO_ADDRESS, SuperfluidHost);

  const makeTransactions = async (approvalVal) => {
    const flowRate = "385802469135";

    const sTokenContract = _sTokenContract.attach(daix.address);
    const cfaContract = _cfaContract.attach(CFA_ADDRESS);
    const sfHost = _sfHost.attach(SF_HOST_ADDRESS);

    const cfaFunctionEncodedData = cfaContract.interface.encodeFunctionData(
      "createFlow",
      [
        daix.address, // token address
        RECEIVER_ADDRESS, //receiver address
        flowRate, // flow rate
        "0x",
      ]
    );

    const cfaDeleteFunctionEncodedData =
      cfaContract.interface.encodeFunctionData("deleteFlow", [
        daix.address, // token address
        ownerSafeAddress, // sender
        RECEIVER_ADDRESS, // receiver
        "0x",
      ]);

    console.log({
      dai: dai.address,
      daix: daix.address,
    });

    const transactions = [
      // approval
      {
        operation: 0,
        to: dai.address,
        value: 0,
        data: dai.interface.encodeFunctionData("approve", [
          daix.address,
          value(approvalVal),
        ]),
      },
      // upgrade
      {
        operation: 0,
        to: daix.address,
        value: 0,
        data: sTokenContract.interface.encodeFunctionData("upgrade", [
          value(approvalVal),
        ]),
      },
      // start flow
      {
        operation: 1,
        to: SF_HOST_ADDRESS,
        value: 0,
        data: sfHost.interface.encodeFunctionData("callAgreement", [
          CFA_ADDRESS,
          cfaFunctionEncodedData,
          "0x", // user ctx data
        ]),
      },
      //cancel flow
      // {
      //   operation: 0,
      //   to: SF_HOST_ADDRESS,
      //   value: 0,
      //   data: sfHost.interface.encodeFunctionData("callAgreement", [
      //     CFA_ADDRESS,
      //     cfaDeleteFunctionEncodedData,
      //     "0x", // no data
      //   ]),
      // },
    ];

    const recipients = [
      "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5",
      "0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e",
      "0x07ee55aa48bb72dcc6e9d78256648910de513eca",
      "0x73bceb1cd57c711feac4224d062b0f6ff338501e",
      "0x61edcdf5bb737adffe5043706e7c5bb1f1a56eea",
      "0x229b5c097f9b35009ca1321ad2034d4b3d5070f6",
      "0xe853c56864a2ebe4576a807d26fdc4a0ada51919",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "0x742d35cc6634c0532925a3b844bc454e4438f44e",
      "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8",
      "0xdc76cd25977e0a5ae17155770273ad58648900d3",
      "0x53d284357ec70ce289d6d64134dfac8e511c8a3d",
      "0x00000000219ab540356cbb839cbe05303d7705fa",
    ];

    let deleteTxns = [];

    recipients.forEach((rec) => {
      const txnData = cfaContract.interface.encodeFunctionData("deleteFlow", [
        daix.address,
        ownerSafeAddress,
        rec,
        "0x",
      ]);
      const sfTxnData = {
        operation: 0,
        to: SF_HOST_ADDRESS,
        value: 0,
        data: sfHost.interface.encodeFunctionData("callAgreement", [
          CFA_ADDRESS,
          txnData,
          "0x", // no data
        ]),
      };
      deleteTxns.push(sfTxnData);
    });

    // console.log({ transactions });

    await executeBatchTransactions({
      transactions: deleteTxns,
    });
  };

  return (
    <div
      style={{
        fontSize: 16,
        display: "flex",
        flexDirection: "row",
        gap: 36,
        marginTop: 36,
      }}
    >
      <div>
        <pre>{JSON.stringify(assets, "", 2)}</pre>
        <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
          {/* <input
            defaultValue={approvalValue}
            type="number"
            onChange={(e) => setApprovalValue(e.target.value)}
          /> */}
          <button onClick={() => makeTransactions(approvalValue)}>
            Delete Flows
          </button>
        </div>
      </div>
      <div>
        <pre>{JSON.stringify(receiverDetails, "", 2)}</pre>
      </div>
    </div>
  );
}
