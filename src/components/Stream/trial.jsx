import { wad4human } from "@decentral.ee/web3-helpers";
import SF from "@superfluid-finance/js-sdk";
import ISuperTokenABI from "constants/abis/ISuperToken.json";
import ConstantFlowAgreement from "constants/abis/ConstantFlowAgreement.json";
import SuperfluidHost from "constants/abis/SuperfluidHost.json";
import { useActiveWeb3React, useContract } from "hooks";
import { useAddresses } from "hooks/useAddresses";
import useBatchTransaction from "hooks/useBatchTransactions";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getAmountInWei } from "utils/tx-helpers";

let sf, dai, daix, matic, maticx, app;

// https://docs.superfluid.finance/superfluid/protocol-developers/networks#test-networks
// Polygon MATIC
const CFA_ADDRESS = "0x6EeE6060f715257b970700bc2656De21dEdF074C";
const SF_HOST_ADDRESS = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";

const RECEIVER_ADDRESS = "0xa78a6CFDe1c40f9fBdaa1a3DD6ac9AeD0bBe3A84";

let pollBalancesInterval;

export default function StreamUITrial() {
  const { library, account } = useActiveWeb3React();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const [approvalValue, setApprovalValue] = useState(0.01);
  const [receiverDetails, setReceiverDetails] = useState({});

  const [assets, setAssets] = useState({
    daiBalance: 0,
    daixBalance: 0,
    allowedDAI: 0,
  });

  const fetchBalances = useCallback(async () => {
    console.log(" --- Fetching balances");
    if (ownerSafeAddress) {
      const daiBalance = await dai.balanceOf(ownerSafeAddress);
      const daixBalance = await daix.balanceOf(ownerSafeAddress);
      const allowedDAI = await dai.allowance(ownerSafeAddress, daix.address);

      const maticBalance_receiver = await matic.balanceOf(ownerSafeAddress);
      const maticXBalance_receiver = await maticx.balanceOf(ownerSafeAddress);

      const maticBalance_sender = await matic.balanceOf(RECEIVER_ADDRESS);
      const maticXBalance_sender = await maticx.balanceOf(RECEIVER_ADDRESS);

      // const accountAllowedDAI = await dai.allowance(account, daix.address);
      setAssets({
        daiBalance: wad4human(daiBalance),
        daixBalance: wad4human(daixBalance),
        allowedDAI: wad4human(allowedDAI),

        // maticBalance_receiver: wad4human(maticBalance_receiver),
        // maticXBalance_receiver: wad4human(maticXBalance_receiver),
        // // accountAllowedDAI: wad4human(accountAllowedDAI),

        // maticBalance_sender: wad4human(maticBalance_sender),
        // maticXBalance_sender: wad4human(maticXBalance_sender),
      });
    }

    const sender = sf.user({
      address: ownerSafeAddress,
      token: daix.address,
    });
    // const senderMatic = sf.user({
    //   address: ownerSafeAddress,
    //   token: matic.address,
    // });
    const receiver = sf.user({
      address: RECEIVER_ADDRESS,
      token: daix.address,
    });
    // const receiverMatic = sf.user({
    //   address: RECEIVER_ADDRESS,
    //   token: maticx.address,
    // });

    setReceiverDetails({
      receiver: {
        address: RECEIVER_ADDRESS,
        ...(await receiver.details()),
      },
      sender: {
        address: ownerSafeAddress,
        ...(await sender.details()),
      },
    });

    console.log(" --- Fetched balances");
  }, [ownerSafeAddress]);

  const logSFDetails = useCallback(async () => {
    sf = new SF.Framework({
      ethers: library,
      tokens: ["DAI", "MATIC"],
    });
    await sf.initialize();

    console.log({ sf });

    dai = await sf.contracts.TestToken.at(sf.tokens.DAI.address);
    daix = sf.tokens.DAIx;

    matic = sf.tokens.WMATIC;
    maticx = sf.tokens.MATICx;

    console.log({ matic, maticx });

    pollBalancesInterval = setInterval(fetchBalances, 5000);
    // fetchBalances();
  }, [fetchBalances, library]);
  const { executeBatchTransactions } = useBatchTransaction();

  const addresses = useAddresses();
  const _sTokenContract = useContract(addresses.ZERO_ADDRESS, ISuperTokenABI);
  const _cfaContract = useContract(
    addresses.ZERO_ADDRESS,
    ConstantFlowAgreement
  );
  const _sfHost = useContract(addresses.ZERO_ADDRESS, SuperfluidHost);

  useEffect(() => {
    if (account && ownerSafeAddress) {
      logSFDetails();
    }
  }, [account, ownerSafeAddress, logSFDetails]);

  useEffect(() => {
    return () => {
      clearInterval(pollBalancesInterval);
    };
  }, []);

  const value = (val) => getAmountInWei(val, 18).toString();

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

    const transactions = [
      // approval
      // {
      //   operation: 0,
      //   to: dai.address,
      //   value: 0,
      //   data: dai.interface.encodeFunctionData("approve", [
      //     daix.address,
      //     value(approvalVal),
      //   ]),
      // },
      // upgrade
      // {
      //   operation: 0,
      //   to: daix.address,
      //   value: 0,
      //   data: sTokenContract.interface.encodeFunctionData("upgrade", [
      //     value(approvalVal),
      //   ]),
      // },
      // start flow
      // {
      //   operation: 0,
      //   to: SF_HOST_ADDRESS,
      //   value: 0,
      //   data: sfHost.interface.encodeFunctionData("callAgreement", [
      //     CFA_ADDRESS,
      //     cfaFunctionEncodedData,
      //     "0x", // user ctx data
      //   ]),
      // },
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

    // await executeBatchTransactions({
    //   transactions,
    // });
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
          <input
            defaultValue={approvalValue}
            type="number"
            onChange={(e) => setApprovalValue(e.target.value)}
          />
          <button onClick={() => makeTransactions(approvalValue)}>
            Approve allowance {approvalValue}
          </button>
        </div>
      </div>
      <div>
        <pre>{JSON.stringify(receiverDetails, "", 2)}</pre>
      </div>
    </div>
  );
}
