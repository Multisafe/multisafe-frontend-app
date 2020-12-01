import React, { useContext, useEffect, useMemo, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLongArrowAltRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { cryptoUtils } from "parcel-sdk";
import { BigNumber } from "@ethersproject/bignumber";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewDepartmentsReducer from "store/view-departments/reducer";
import { getDepartments } from "store/view-departments/actions";
import viewDepartmentsSaga from "store/view-departments/saga";
import viewTeammatesSaga from "store/view-teammates/saga";

import viewTeammatesReducer from "store/view-teammates/reducer";
import { getAllTeammates } from "store/view-teammates/actions";
import {
  makeSelectDepartments,
  makeSelectTotalEmployees,
  makeSelectLoading as makeSelectDepartmentsLoading,
} from "store/view-departments/selectors";
import {
  makeSelectTeammates,
  makeSelectLoading as makeSelectTeammatesLoading,
} from "store/view-teammates/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";
import { useActiveWeb3React, useContract, useLocalStorage } from "hooks";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ERC20ABI from "constants/abis/ERC20.json";
import MultiSendABI from "constants/abis/MultiSend.json";
// import { numToOrd } from "utils/date-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import {
  joinHexData,
  getHexDataLength,
  standardizeTransaction,
} from "utils/tx-helpers";
// import Loading from "components/common/Loading";

// import GuyPng from "assets/icons/guy.png";

import { Container, Table, PaymentSummary } from "./styles";
// import { Circle } from "components/Header/styles";
import { minifyAddress } from "components/common/Web3Utils";

const { TableBody, TableHead, TableRow } = Table;
const viewTeammatesKey = "viewTeammates";
const viewDepartmentsKey = "viewDepartments";

const { DAI_ADDRESS, MULTISEND_ADDRESS } = addresses;

const tokenNameToAddress = {
  DAI: DAI_ADDRESS,
  // add other tokens here
};

const TABS = {
  PEOPLE: "1",
  DEPARTMENT: "2",
};

const navStyles = `
  .nav-tabs {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border-bottom: solid 1px #f2f2f2;
    background-color: #ffffff;
  }

  .nav-link {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
    cursor: pointer;
    opacity: 0.4;
    padding-bottom: 15px;
    padding-top: 15px;
  }

  .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    border-bottom: 5px solid #7367f0;
  }

  .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {
    border: none;
    border-bottom: 5px solid #7367f0;
    opacity: 1;
  }

  .nav-link.active {
    opacity: 1;
    border: none;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
`;

// [{
//   name, department, token, amount, address
// }]

export default function People() {
  const { account, library } = useActiveWeb3React();
  // const [listOfTeammates, setListOfTeammates] = useState([]);
  const [checked, setChecked] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [sign] = useLocalStorage("SIGNATURE");
  const [toggled] = useContext(SideNavContext);
  const [activeTab, setActiveTab] = useState(TABS.PEOPLE);
  const [loadingTx, setLoadingTx] = useState(false);
  const [txHash, setTxHash] = useState(""); // eslint-disable-line
  const [selectedRows, setSelectedRows] = useState([]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });
  useInjectReducer({
    key: viewDepartmentsKey,
    reducer: viewDepartmentsReducer,
  });

  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });
  useInjectSaga({ key: viewDepartmentsKey, saga: viewDepartmentsSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectDepartments());
  const totalEmployees = useSelector(makeSelectTotalEmployees()); // eslint-disable-line
  const loadingDepartments = useSelector(makeSelectDepartmentsLoading()); // eslint-disable-line
  const loadingTeammates = useSelector(makeSelectTeammatesLoading()); // eslint-disable-line
  const teammates = useSelector(makeSelectTeammates());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // contracts
  const proxyContract = useContract(ownerSafeAddress, GnosisSafeABI, true);
  const dai = useContract(DAI_ADDRESS, ERC20ABI, true);
  const multiSend = useContract(MULTISEND_ADDRESS, MultiSendABI);

  useEffect(() => {
    if (!teammates || !teammates.length) {
      dispatch(getAllTeammates(ownerSafeAddress));
    }
    if (!allDepartments || !allDepartments.length) {
      dispatch(getDepartments(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, teammates, allDepartments]);

  useEffect(() => {
    if (teammates && teammates.length > 0) {
      setChecked(new Array(teammates.length).fill(false));
    }
  }, [teammates]);

  const isNoneChecked = useMemo(() => checked.every((check) => !check), [
    checked,
  ]);

  const getDecryptedDetails = (data) => {
    if (!sign) return "";
    return JSON.parse(cryptoUtils.decryptData(data, sign));
  };

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

  const handleMassPayout = async (selectedTeammates) => {
    if (account && library) {
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(account),
      });

      const transactions = selectedTeammates.map(
        ({ address, salaryToken, salaryAmount }) => ({
          operation: 0, // CALL
          to: tokenNameToAddress[salaryToken],
          value: 0,
          data: dai.interface.encodeFunctionData("transfer", [
            address,
            BigNumber.from(salaryAmount).mul(BigNumber.from(String(10 ** 18))),
          ]),
        })
      );

      const dataHash = encodeMultiSendCallData(transactions, ethLibAdapter);

      // Set parameters of execTransaction()
      const valueWei = 0;
      const data = dataHash;
      const operation = 1; // DELEGATECALL
      const gasPrice = 0; // If 0, then no refund to relayer
      const gasToken = "0x0000000000000000000000000000000000000000"; // ETH
      const txGasEstimate = 0;
      const baseGasEstimate = 0;
      const executor = "0x0000000000000000000000000000000000000000";

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

        const tx = await proxyContract.execTransaction(
          MULTISEND_ADDRESS,
          valueWei,
          data,
          operation,
          txGasEstimate,
          baseGasEstimate,
          gasPrice,
          gasToken,
          executor,
          autoApprovedSignature,
          { gasLimit: "300000", gasPrice: "10000000000" }
        );

        await tx.wait();

        setTxHash(tx.hash);
        setLoadingTx(false);
      } catch (err) {
        setLoadingTx(false);
        console.error(err);
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log({ selectedRows });

    await handleMassPayout(selectedRows);
  };

  const handleCheckAll = (e) => {
    if (checked.every((check) => check)) {
      // deselect all
      setChecked(new Array(checked.length).fill(false));
      setIsCheckedAll(false);
      setSelectedRows([]);
    } else {
      // select all
      setChecked(new Array(checked.length).fill(true));
      setIsCheckedAll(true);
      if (teammates.length > 0) {
        const allRows = teammates.map(({ data }) => getDecryptedDetails(data));
        setSelectedRows(allRows);
      }
    }
  };

  const handleChecked = (e, teammateDetails, index) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
    // if checked, push the details, provided it doesn't already exist in the array
    // else remove the unselected details from the array
    if (
      e.target.checked &&
      !selectedRows.some((row) => row.address === teammateDetails.address)
    ) {
      setSelectedRows([...selectedRows, teammateDetails]);
    } else {
      setSelectedRows(
        selectedRows.filter((row) => row.address !== teammateDetails.address)
      );
    }
  };

  return (
    <div
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <div>
        <Info>
          <div
            style={{
              maxWidth: toggled ? "900px" : "1280px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="title">Payments</div>
            <div className="subtitle">
              You can instantly pay or manage team payrolls
            </div>
          </div>
        </Info>
        <Container
          style={{
            maxWidth: toggled ? "900px" : "1280px",
            transition: "all 0.25s linear",
          }}
        >
          <form onSubmit={onSubmit}>
            <style>{navStyles}</style>
            <Card style={{ minHeight: "532px" }} className="pt-3">
              <Nav tabs>
                <NavItem className="px-3">
                  <NavLink
                    className={`${activeTab === TABS.PEOPLE ? "active" : ""}`}
                    onClick={() => toggle(TABS.PEOPLE)}
                  >
                    People
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${
                      activeTab === TABS.DEPARTMENT ? "active" : ""
                    }`}
                    onClick={() => toggle(TABS.DEPARTMENT)}
                  >
                    Department
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={TABS.PEOPLE}>
                  <TableHead>
                    <div className="form-check d-flex">
                      <input
                        className="form-check-input position-static mr-3"
                        type="checkbox"
                        id="allCheckbox"
                        checked={isCheckedAll}
                        onChange={handleCheckAll}
                      />
                      <div>Employee Name</div>
                    </div>
                    <div>Department</div>
                    <div>Pay Token</div>
                    <div>Pay Amount</div>
                    <div>Address</div>
                    <div></div>
                  </TableHead>
                  <TableBody>
                    {teammates.length > 0 &&
                      teammates.map(({ data, departmentName }, idx) => {
                        const {
                          firstName,
                          lastName,
                          salaryAmount,
                          salaryToken,
                          address,
                        } = getDecryptedDetails(data);
                        return (
                          <TableRow key={address}>
                            <div className="form-check d-flex">
                              <input
                                className="form-check-input position-static mr-3"
                                type="checkbox"
                                id={`checkbox${idx}`}
                                name={`checkbox${idx}`}
                                // data-value={JSON.stringify({
                                //   firstName,
                                //   lastName,
                                //   salaryAmount,
                                //   salaryToken,
                                //   address,
                                // })}
                                checked={checked[idx] || false}
                                onChange={(e) => {
                                  const teammateDetails = {
                                    firstName,
                                    lastName,
                                    salaryToken,
                                    salaryAmount,
                                    address,
                                  };
                                  handleChecked(e, teammateDetails, idx);
                                }}
                              />
                              <div>
                                {firstName} {lastName}
                              </div>
                            </div>
                            <div>{departmentName}</div>
                            <div>{salaryToken}</div>
                            <div>
                              {salaryAmount} {salaryToken} (US${salaryAmount})
                            </div>
                            <div>{minifyAddress(address)}</div>
                            <div className="text-right">
                              {checked.filter(Boolean).length <= 1 && (
                                <Button
                                  type="submit"
                                  iconOnly
                                  disabled={
                                    !checked[idx] || loadingTx || isNoneChecked
                                  }
                                >
                                  <span className="pay-text">PAY</span>
                                </Button>
                              )}
                            </div>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </TabPane>
                <TabPane tabId={TABS.DEPARTMENT}>
                  <div className="p-4">Departments</div>
                </TabPane>
              </TabContent>

              {!isNoneChecked && (
                <PaymentSummary>
                  <div className="payment-info">
                    <div>
                      <div className="payment-title">Total Selected</div>
                      <div className="payment-subtitle">36 people</div>
                    </div>
                    <div>
                      <div className="payment-title">Total Amount</div>
                      <div className="payment-subtitle">US$ 10000</div>
                    </div>
                    <div>
                      <div className="payment-title">Balance after payment</div>
                      <div className="payment-subtitle">US$ 100</div>
                    </div>
                  </div>

                  <div className="pay-button">
                    <Button
                      type="submit"
                      large
                      loading={loadingTx}
                      disabled={loadingTx || isNoneChecked}
                    >
                      Pay Now
                    </Button>
                  </div>
                </PaymentSummary>
              )}
            </Card>
          </form>
        </Container>
      </div>
    </div>
  );
}
