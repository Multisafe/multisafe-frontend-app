import { useState, useEffect } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/common/Button";
import {
  makeSelectOwnerSafeAddress,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import { useEncryptionKey } from "hooks";
import Dropzone from "components/common/Dropzone";
import { FIELD_NAMES, isValidField } from "store/add-people/utils";
import { Table, TableHead, TableBody } from "components/common/Table";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import Img from "components/common/Img";
import UploadSuccessIcon from "assets/icons/dashboard/upload-success-icon.svg";
import UploadFailIcon from "assets/icons/dashboard/upload-fail-icon.svg";
import {
  makeSelectTokenList,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import { formatNumber } from "utils/number-helpers";
import { UploadScreen, UploadStatus } from "components/People/styles";
import { constructLabel } from "utils/tokens";
import { formatText } from "utils/string-utils";
import { updateForm } from "store/new-transfer/actions";

export const MODAL_NAME = "upload-csv-transfer-modal";

function UploadCsvModal(props) {
  const { show, handleHide } = props;
  const [encryptionKey] = useEncryptionKey();

  const [csvData, setCSVData] = useState();
  const [invalidCsvData, setInvalidCsvData] = useState(false);
  const [invalidCsvDataMessage, setInvalidCsvDataMessage] = useState();
  const [fileName, setFileName] = useState();
  const [tokenToPaymentDetailsMap, setTokenToPaymentDetailsMap] = useState();

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const tokenList = useSelector(makeSelectTokenList());

  useEffect(() => {
    setInvalidCsvData(false);
    setInvalidCsvDataMessage();
  }, [csvData]);

  useEffect(() => {
    if (csvData) {
      const tokenToPaymentDetailsMap = {};
      for (let i = 0; i < csvData.length; i++) {
        const { tokenName, payUsdInToken } = csvData[i];

        let tokenSymbol = tokenName;

        if (tokenName === "USD") {
          tokenSymbol = payUsdInToken;
        }

        if (!tokenToPaymentDetailsMap[tokenSymbol]) {
          tokenToPaymentDetailsMap[tokenSymbol] = [csvData[i]];
        } else {
          tokenToPaymentDetailsMap[tokenSymbol].push(csvData[i]);
        }
      }

      setTokenToPaymentDetailsMap(tokenToPaymentDetailsMap);
    }
  }, [csvData]);

  const handleDrop = (data, fileName) => {
    setFileName(fileName);
    // checking for at least 6 columns in the csv
    if (!data || data.length === 0 || data.some((arr) => arr.length < 7)) {
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
          tokenValue: arr[3],
          tokenName: arr[4],
          payUsdInToken: arr[5],
          departmentName: arr[6],
        },
      ];
    }, []);

    setCSVData(formattedData);
  };

  const handleDropRejected = (errorMessage) => {
    setInvalidCsvData(true);
    setInvalidCsvDataMessage(errorMessage);
  };

  const handleRemove = () => {
    setFileName("");
    setCSVData(null);
  };

  const onConfirm = () => {
    if (!encryptionKey || !ownerSafeAddress) return;

    const batch = Object.keys(tokenToPaymentDetailsMap).map((tokenName) => {
      const token = tokenList
        .filter((details) => details.name === tokenName)
        .map((details) => ({
          value: details.name,
          label: constructLabel({
            token: details.name,
            component: (
              <div>
                {formatNumber(details.balance, 5)} {details.name}
              </div>
            ),
            imgUrl: details.icon,
          }),
        }))[0];

      return {
        token,
        receivers: tokenToPaymentDetailsMap[tokenName].map(
          ({
            firstName,
            lastName,
            address,
            tokenValue,
            tokenName,
            payUsdInToken,
            departmentName,
          }) => ({
            name: formatText(`${firstName} ${lastName}`),
            address,
            tokenValue: tokenName !== "USD" ? tokenValue : "",
            isDisabled: 0,
            departmentName,
            tokenName: tokenName === "USD" ? payUsdInToken : tokenName,
            fiatValue: tokenName === "USD" ? tokenValue : "",
          })
        ),
      };
    });

    dispatch(updateForm({ batch }));
    handleHide();
  };

  const renderCsvRow = ({
    firstName,
    lastName,
    address,
    tokenValue,
    tokenName,
    payUsdInToken,
    departmentName,
    idx,
  }) => {
    const invalidName =
      !isValidField(FIELD_NAMES.FIRST_NAME, firstName) ||
      !isValidField(FIELD_NAMES.LAST_NAME, lastName);
    const invalidAddress = !isValidField(FIELD_NAMES.ADDRESS, address);
    const invalidPayDetails =
      !isValidField(FIELD_NAMES.TOKEN_VALUE, tokenValue) ||
      !isValidField(FIELD_NAMES.TOKEN, tokenName, tokenDetails);
    const invalidPayInUsd = !isValidField(
      FIELD_NAMES.PAY_USD_IN_TOKEN,
      tokenName,
      tokenDetails,
      { tokenName }
    );

    const isCsvDataInvalid =
      invalidName || invalidAddress || invalidPayDetails || invalidPayInUsd;

    if (isCsvDataInvalid && !invalidCsvData) {
      setInvalidCsvData(true);
    }

    return (
      <tr key={`${address}-${idx}`}>
        <td className={`${invalidName && "text-red"}`} style={{ width: "20%" }}>
          {firstName} {lastName}
        </td>
        <td
          className={`${invalidPayDetails && "text-red"}`}
          style={{ width: "13%" }}
        >
          {tokenValue && (
            <span>
              {formatNumber(tokenValue, 5)} {tokenName}
            </span>
          )}
        </td>
        <td
          className={`${invalidPayInUsd && "text-red"}`}
          style={{ width: "12%" }}
        >
          {payUsdInToken}
        </td>
        <td
          className={`${invalidAddress && "text-red"}`}
          style={{ width: "40%" }}
        >
          {address}
        </td>
        <td style={{ width: "15%" }}>{departmentName}</td>
      </tr>
    );
  };

  const renderUploadScreen = () => {
    return (
      <UploadScreen>
        <div className="text">Pay to multiple people quickly.</div>
        <div className="my-4">
          <Dropzone
            onDrop={handleDrop}
            onDropRejected={handleDropRejected}
            style={{ minHeight: "16rem" }}
          />
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
              {invalidCsvDataMessage ||
                `Oops, something is not right. Please check your csv file.`}
            </div>
          </div>
        )}

        <div className="points-to-remember">
          <div className="title">Some points to remember</div>
          <ul className="points">
            <li>Please make sure the file extension is .csv</li>
            <li>
              Last name and team are optional fields. Rest of the fields are
              required
            </li>
            <li>You can add multiple tokens in the csv</li>
            <li>The amount can be edited later as well</li>
          </ul>
        </div>
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
        <Table>
          <TableHead>
            <tr>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "13%" }}>Pay Amount</th>
              <th style={{ width: "12%" }}>Pay USD In</th>
              <th style={{ width: "40%" }}>Address</th>
              <th style={{ width: "15%" }}>Team</th>
            </tr>
          </TableHead>

          <TableBody
            style={{ minHeight: "10rem", height: "30rem", overflow: "auto" }}
          >
            {csvData.map(
              (
                {
                  firstName,
                  lastName,
                  address,
                  tokenValue,
                  tokenName,
                  payUsdInToken,
                  departmentName,
                },
                idx
              ) =>
                renderCsvRow({
                  firstName,
                  lastName,
                  address,
                  tokenValue,
                  tokenName,
                  payUsdInToken,
                  departmentName,
                  idx,
                })
            )}
          </TableBody>
        </Table>

        {!invalidCsvData ? (
          <div
            className="d-flex justify-content-end"
            style={{ margin: "2rem" }}
          >
            <Button
              type="button"
              width="15rem"
              onClick={onConfirm}
              disabled={invalidCsvData || isReadOnly}
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

  const renderUploadCsv = () => {
    const hasCsvData = csvData && csvData.length > 0;
    return !hasCsvData ? renderUploadScreen() : renderCsvData();
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Upload CSV"} toggle={handleHide} />
      <ModalBody width="100rem">{renderUploadCsv()}</ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(UploadCsvModal);
