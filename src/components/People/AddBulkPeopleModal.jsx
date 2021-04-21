import React, { useState, useEffect } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/common/Button";
import { UploadScreen, UploadStatus } from "./styles";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
} from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { cryptoUtils } from "parcel-sdk";

import addPeopleReducer from "store/add-people/reducer";
import { useLocalStorage } from "hooks";
import { addBulkPeople } from "store/add-people/actions";
import addPeopleSaga from "store/add-people/saga";
import {
  makeSelectSuccess,
  makeSelectLoading,
} from "store/add-people/selectors";
import Dropzone from "components/common/Dropzone";
import { FIELD_NAMES, isValidField } from "store/add-people/utils";
import { Table, TableHead, TableBody } from "components/common/Table";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import Img from "components/common/Img";
import UploadSuccessIcon from "assets/icons/dashboard/upload-success-icon.svg";
import UploadFailIcon from "assets/icons/dashboard/upload-fail-icon.svg";

export const MODAL_NAME = "add-bulk-people-modal";
const addPeopleKey = "addPeople";

function AddBulkPeopleModal(props) {
  const { show, handleHide } = props;
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const [success, setSuccess] = useState(false);
  const [csvData, setCSVData] = useState();
  const [invalidCsvData, setInvalidCsvData] = useState(false);
  const [fileName, setFileName] = useState();

  useInjectReducer({ key: addPeopleKey, reducer: addPeopleReducer });

  useInjectSaga({ key: addPeopleKey, saga: addPeopleSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const addBulkSuccess = useSelector(makeSelectSuccess());
  const loading = useSelector(makeSelectLoading());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (addBulkSuccess && success) {
      setCSVData(null);
      setSuccess(false);
      // history.push("/dashboard/people/view");
    }
  }, [addBulkSuccess, success]);

  useEffect(() => {
    setInvalidCsvData(false);
  }, [csvData]);

  const handleDrop = (data, fileName) => {
    setFileName(fileName);
    // checking for at least 6 columns in the csv
    if (!data || data.length === 0 || data.some((arr) => arr.length < 6)) {
      setInvalidCsvData(true);
      return;
    }
    const formattedData = data.reduce((formatted, arr, i) => {
      return [
        ...formatted,
        {
          firstName: arr[0],
          lastName: arr[1],
          address: arr[2],
          salaryAmount: arr[3],
          salaryToken: arr[4],
          departmentName: arr[5],
        },
      ];
    }, []);
    setCSVData(formattedData);
  };

  const handleRemove = () => {
    setFileName("");
    setCSVData(null);
  };

  const onAddBulkTeammates = () => {
    if (!encryptionKey || !ownerSafeAddress) return;

    let index = 0;
    const uniqueDepartmentsHashmap = csvData.reduce(
      (hashmap, { departmentName }) => {
        if (!hashmap[departmentName]) {
          hashmap[departmentName] = index;
          index++;
        }
        return hashmap;
      },
      {}
    );

    const finalData = Object.keys(uniqueDepartmentsHashmap)
      .reduce((data, uniqueDepartmentName) => {
        for (let i = 0; i < csvData.length; i++) {
          const {
            firstName,
            lastName,
            salaryAmount,
            salaryToken,
            address,
            departmentName,
          } = csvData[i];

          const encryptedEmployeeDetails = cryptoUtils.encryptDataUsingEncryptionKey(
            JSON.stringify({
              firstName,
              lastName,
              salaryAmount,
              salaryToken,
              address,
            }),
            encryptionKey,
            organisationType
          );

          const uniqueIndex = uniqueDepartmentsHashmap[uniqueDepartmentName];
          // this index is for each department. ex: 0 = HR, 1 = Engineering etc.

          if (departmentName === uniqueDepartmentName) {
            if (!data[uniqueIndex]) {
              data[uniqueIndex] = {
                departmentName,
                peopleDetails: [
                  {
                    encryptedEmployeeDetails,
                  },
                ],
              };
            } else
              data[uniqueIndex].peopleDetails.push({
                encryptedEmployeeDetails,
              });
          }
        }
        return data;
      }, [])
      .filter(Boolean);

    dispatch(
      addBulkPeople({
        safeAddress: ownerSafeAddress,
        createdBy: ownerSafeAddress,
        data: finalData,
      })
    );
    setSuccess(true);
  };

  const renderCsvRow = ({
    firstName,
    lastName,
    address,
    salaryAmount,
    salaryToken,
    departmentName,
    idx,
  }) => {
    const invalidName =
      !isValidField(FIELD_NAMES.FIRST_NAME, firstName) ||
      !isValidField(FIELD_NAMES.LAST_NAME, lastName);
    const invalidAddress = !isValidField(FIELD_NAMES.ADDRESS, address);
    const invalidPayDetails =
      !isValidField(FIELD_NAMES.AMOUNT, salaryAmount) ||
      !isValidField(FIELD_NAMES.TOKEN, salaryToken);
    const invalidDepartment = !isValidField(
      FIELD_NAMES.DEPARTMENT_NAME,
      departmentName
    );

    const isCsvDataValid =
      invalidName || invalidAddress || invalidPayDetails || invalidDepartment;

    if (isCsvDataValid && !invalidCsvData) {
      setInvalidCsvData(true);
    }

    return (
      <tr key={`${address}-${idx}`} col={4}>
        <td className={`${invalidName && "text-red"}`}>
          {firstName} {lastName}
        </td>
        <td className={`${invalidDepartment && "text-red"}`}>
          {departmentName}
        </td>
        <td className={`${invalidPayDetails && "text-red"}`}>
          {salaryAmount} {salaryToken}
        </td>
        <td className={`${invalidAddress && "text-red"}`}>{address}</td>
      </tr>
    );
  };

  const renderUploadScreen = () => {
    return (
      <UploadScreen>
        <div className="text">Add multiples teammates quickly.</div>
        <div className="my-4">
          <Dropzone onDrop={handleDrop} style={{ minHeight: "16rem" }} />
        </div>
        <div>
          <a
            href="https://drive.google.com/file/d/1uf1Ms8VkJkAC8kX9AM6XGC7gGIVZOBRB/view?usp=sharing"
            rel="noreferrer noopener"
            target="_blank"
            className="format-csv"
          >
            Download Format CSV
          </a>
        </div>
        {invalidCsvData && (
          <div className="mt-4">
            <div className="text-red" style={{ fontSize: "1.4rem" }}>
              Oops, something is not right. Please check your csv file.
            </div>
          </div>
        )}
      </UploadScreen>
    );
  };

  const renderCsvData = () => {
    return (
      <div>
        <UploadStatus>
          {!invalidCsvData ? (
            <div className="status">
              <Img src={UploadSuccessIcon} alt="upload-success" />
              <div className="success">File uploaded successfully</div>
              <div className="file-name">{fileName}</div>
              <div className="remove-file" onClick={handleRemove}>
                Remove File
              </div>
            </div>
          ) : (
            <div className="status">
              <Img src={UploadFailIcon} alt="upload-success" />
              <div className="fail">File upload unsuccessfull</div>
              <div className="file-name">{fileName}</div>
              <div className="remove-file" onClick={handleRemove}>
                Remove File
              </div>
            </div>
          )}
          <div className="csv-title">Adding {csvData.length} people</div>
        </UploadStatus>
        <div style={{ minHeight: "100px", height: "300px", overflow: "auto" }}>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: "20%" }}>Name</th>
                <th style={{ width: "20%" }}>Team</th>
                <th style={{ width: "22%" }}>Disbursement</th>
                <th style={{ width: "38%" }}>Address</th>
              </tr>
            </TableHead>

            <TableBody>
              {csvData.map(
                (
                  {
                    firstName,
                    lastName,
                    address,
                    salaryAmount,
                    salaryToken,
                    departmentName,
                  },
                  idx
                ) =>
                  renderCsvRow({
                    firstName,
                    lastName,
                    address,
                    salaryAmount,
                    salaryToken,
                    departmentName,
                    idx,
                  })
              )}
            </TableBody>
          </Table>
        </div>

        {!invalidCsvData ? (
          <div
            className="d-flex justify-content-end"
            style={{ margin: "2rem 6rem" }}
          >
            <Button
              type="button"
              width="15rem"
              onClick={onAddBulkTeammates}
              disabled={loading || invalidCsvData}
              loading={loading}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <div style={{ margin: "3rem 2rem" }}>
            <div className="text-red" style={{ fontSize: "1.4rem" }}>
              Oops, something is not right. Please check your csv file and fix
              the issues.
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAddBulkPeople = () => {
    const hasCsvData = csvData && csvData.length > 0;
    return !hasCsvData ? renderUploadScreen() : renderCsvData();
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader
        style={{ borderBottom: "none" }}
        title={"Upload CSV"}
        toggle={handleHide}
      />
      <ModalBody width="100rem">{renderAddBulkPeople()}</ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddBulkPeopleModal);
