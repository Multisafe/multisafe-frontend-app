import { useState, useEffect, useMemo } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/common/Button";
import {
  makeSelectOwnerSafeAddress,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import { useEncryptionKey } from "hooks";
import Dropzone from "components/common/Dropzone";
import { FIELD_NAMES, isValidField } from "store/new-transfer/utils";
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
import { Bullet } from "./styles/UploadCsv";
import { constructLabel } from "utils/tokens";
import { formatText } from "utils/string-utils";
import { updateForm } from "store/new-transfer/actions";
import TokenImg from "components/common/TokenImg";

export const MODAL_NAME = "upload-csv-transfer-modal";

function InvalidBullet({ isInvalid }) {
  return isInvalid ? <Bullet /> : null;
}
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

  const tokenListMap = useMemo(() => {
    return tokenList.reduce((acc, curr) => {
      const { address } = curr;
      acc[address] = curr;
      return acc;
    }, {});
  }, [tokenList]);

  useEffect(() => {
    setInvalidCsvData(false);
    setInvalidCsvDataMessage();
  }, [csvData]);

  useEffect(() => {
    if (csvData) {
      const tokenToPaymentDetailsMap = {};
      for (let i = 0; i < csvData.length; i++) {
        const { tokenAddress } = csvData[i];

        if (!tokenToPaymentDetailsMap[tokenAddress]) {
          tokenToPaymentDetailsMap[tokenAddress] = [csvData[i]];
        } else {
          tokenToPaymentDetailsMap[tokenAddress].push(csvData[i]);
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
          usdValue: arr[4],
          tokenAddress: arr[5]?.toLowerCase(),
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

    const batch = Object.keys(tokenToPaymentDetailsMap).map((tokenAddress) => {
      const token = tokenListMap[tokenAddress];
      const details = tokenDetails[tokenAddress];

      return {
        token: {
          value: token.address,
          label: constructLabel({
            token: token.address,
            component: (
              <div>
                {formatNumber(token.balance, 5)} {token?.name}
              </div>
            ),
            imgUrl: details.icon,
          }),
        },
        receivers: tokenToPaymentDetailsMap[tokenAddress].map(
          ({
            firstName,
            lastName,
            address,
            tokenValue,
            usdValue,
            tokenAddress,
            departmentName,
          }) => ({
            name: formatText(`${firstName} ${lastName}`),
            address,
            tokenValue: !usdValue ? tokenValue : "",
            isDisabled: 0,
            departmentName,
            tokenName: token.name,
            fiatValue: !!usdValue ? usdValue : "",
            tokenAddress,
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
    usdValue,
    tokenAddress,
    departmentName,
    idx,
  }) => {
    const token = tokenListMap[tokenAddress];

    const invalidName =
      !isValidField(FIELD_NAMES.FIRST_NAME, firstName) ||
      !isValidField(FIELD_NAMES.LAST_NAME, lastName);
    const invalidAddress = !isValidField(FIELD_NAMES.ADDRESS, address);
    const invalidToken = !isValidField(
      FIELD_NAMES.TOKEN_ADDRESS,
      tokenAddress,
      tokenListMap
    );
    const invalidPayAmount = !isValidField(
      FIELD_NAMES.TOKEN_VALUE,
      tokenValue || usdValue
    );

    const isCsvDataInvalid =
      invalidName || invalidAddress || invalidToken || invalidPayAmount;

    if (isCsvDataInvalid && !invalidCsvData) {
      setInvalidCsvData(true);
    }

    return (
      <tr key={`${address}-${idx}`}>
        <td className={`${invalidName && "text-red"}`} style={{ width: "20%" }}>
          <InvalidBullet isInvalid={invalidName} /> {firstName} {lastName}
        </td>
        <td
          className={`${invalidAddress && "text-red"}`}
          style={{ width: "40%" }}
        >
          <InvalidBullet isInvalid={invalidAddress} /> {address}
        </td>
        <td
          className={`${(invalidToken || invalidPayAmount) && "text-red"}`}
          style={{ width: "25%" }}
        >
          <InvalidBullet isInvalid={invalidToken || invalidPayAmount} />
          <span>
            <TokenImg
              token={token?.name}
              address={tokenAddress}
              className="mr-2"
            />
            <span>
              {formatNumber(tokenValue || usdValue, 5)}
              {usdValue ? " USD in" : ""} {token?.name}
            </span>
          </span>
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
            href="https://drive.google.com/file/d/1kKS_oOLhMrRFpI9UrUdWEvXrh91cj70o/view?usp=sharing"
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
            <li className="accent">
              NEW: please add token address for every entry (check format CSV)
            </li>
            <li>Please make sure the file extension is .csv</li>
            <li>Receiver address and token address are required fields.</li>
            <li>You can add multiple currencies in the csv</li>
            <li>
              If the currency is USD, please specify the "Pay USD in Token" and
              token address field
            </li>
            <li>All entries can be edited later as well</li>
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
              <th style={{ width: "40%" }}>Address</th>
              <th style={{ width: "25%" }}>Pay Amount</th>
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
                  usdValue,
                  departmentName,
                  tokenAddress,
                },
                idx
              ) =>
                renderCsvRow({
                  firstName,
                  lastName,
                  address,
                  tokenValue,
                  usdValue,
                  departmentName,
                  tokenAddress,
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
