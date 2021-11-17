import React, { useState, useEffect } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import Select, { createFilter } from "react-select";
import { cryptoUtils } from "coinshift-sdk";

import Button from "components/common/Button";
import { UploadScreen, UploadStatus } from "./styles";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";

import { useEncryptionKey } from "hooks";
import addPeopleReducer from "store/add-people/reducer";
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
import {
  makeSelectTokensDetails,
  makeSelectTokensDropdown,
} from "store/tokens/selectors";
import {
  makeSelectTeamIdToDetailsMap,
  makeSelectTeams,
} from "store/view-teams/selectors";
import { Input, inputStyles } from "components/common/Form";
import { constructLabel } from "utils/tokens";
import {
  TeamSelection,
  TeamSelectionTitle,
} from "components/People/styles/ImportFromGnosis";
import { MenuList } from "components/common/Form/SelectToken";

export const MODAL_NAME = "add-people-from-gnosis-modal";
const addPeopleKey = "addPeople";

const ADD_TEAM_VALUE = "ADD_TEAM_VALUE";

function AddPeopleFromGnosisModal(props) {
  const { show, handleHide } = props;
  const [encryptionKey] = useEncryptionKey();

  const [success, setSuccess] = useState(false);
  const [csvData, setCSVData] = useState();
  const [invalidCsvData, setInvalidCsvData] = useState(false);
  const [fileName, setFileName] = useState();

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamToken, setTeamToken] = useState(null);
  const [teamName, setTeamName] = useState("");

  useInjectReducer({ key: addPeopleKey, reducer: addPeopleReducer });

  useInjectSaga({ key: addPeopleKey, saga: addPeopleSaga });

  const dispatch = useDispatch();

  const tokensDropdown = useSelector(makeSelectTokensDropdown());
  const loadingTokenList = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const addBulkSuccess = useSelector(makeSelectSuccess());
  const loading = useSelector(makeSelectLoading());
  const organisationType = useSelector(makeSelectOrganisationType());
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const allTeams = useSelector(makeSelectTeams());
  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());

  useEffect(() => {
    if (addBulkSuccess && success) {
      setCSVData(null);
      setSuccess(false);
    }
  }, [addBulkSuccess, success]);

  useEffect(() => {
    setInvalidCsvData(false);
  }, [csvData]);

  const handleDrop = (data, fileName) => {
    setFileName(fileName);
    if (!data || data.length === 0 || data.some((arr) => arr.length < 3)) {
      setInvalidCsvData(true);
      return;
    }
    const formattedData = data.reduce((formatted, arr, i) => {
      return [
        ...formatted,
        {
          firstName: arr[1],
          address: arr[0],
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

    const peopleData = csvData.map(({ firstName, address }) => {
      return {
        encryptedEmployeeDetails: cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify({
            firstName,
            address,
          }),
          encryptionKey,
          organisationType
        ),
      };
    });

    const requestData = [
      {
        departmentName:
          selectedTeam.value === ADD_TEAM_VALUE ? teamName : selectedTeam.label,
        tokenInfo: tokenDetails[teamToken.value],
        peopleDetails: peopleData,
      },
    ];

    dispatch(
      addBulkPeople({
        safeAddress: ownerSafeAddress,
        createdBy: ownerSafeAddress,
        data: requestData,
      })
    );
    setSuccess(true);
  };

  const onTeamChange = (selectedData) => {
    const { value } = selectedData;
    if (value && teamIdToDetailsMap[value]) {
      const { tokenInfo } = teamIdToDetailsMap[value];
      const tokenDropdownValue = {
        value: tokenInfo.symbol,
        label: constructLabel({
          token: tokenInfo.symbol,
          imgUrl: tokenInfo.logoURI,
        }),
      };
      setTeamToken(tokenDropdownValue);
    }
    setSelectedTeam(selectedData);
  };

  const renderCsvRow = ({ firstName, address }) => {
    const invalidName = !isValidField(FIELD_NAMES.FIRST_NAME, firstName);
    const invalidAddress = !isValidField(FIELD_NAMES.ADDRESS, address);

    const isCsvDataValid = invalidName || invalidAddress;

    if (isCsvDataValid && !invalidCsvData) {
      setInvalidCsvData(true);
    }

    return (
      <tr key={`${address}`}>
        <td className={`${invalidName && "text-red"}`} style={{ width: "30%" }}>
          {firstName}
        </td>
        <td
          className={`${invalidAddress && "text-red"}`}
          style={{ width: "70%" }}
        >
          {address}
        </td>
      </tr>
    );
  };

  const renderUploadScreen = () => {
    return (
      <UploadScreen>
        <div className="text">
          Add multiple people from your Gnosis address book.
        </div>
        <div className="my-4">
          <Dropzone onDrop={handleDrop} style={{ minHeight: "16rem" }} />
        </div>
        <div>
          <a
            href="https://help.gnosis-safe.io/en/articles/5299068-address-book-export-and-import"
            rel="noreferrer noopener"
            target="_blank"
            className="format-csv"
          >
            Learn how to export address book from Gnosis
          </a>
        </div>
        {invalidCsvData && (
          <div className="mt-4">
            <div className="text-red" style={{ fontSize: "1.4rem" }}>
              Oops, something is not right. Please check your csv file.
            </div>
          </div>
        )}

        <div className="points-to-remember">
          <div className="title">Some points to remember</div>
          <ul className="points">
            <li>Please make sure the file extension is .csv</li>
            <li>
              Only files in exported from Gnosis, or matching format are
              supported
            </li>
          </ul>
        </div>
      </UploadScreen>
    );
  };

  const renderCsvData = () => {
    const canConfirm =
      (selectedTeam?.value && selectedTeam?.value !== ADD_TEAM_VALUE) ||
      (teamToken?.value && teamName);

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
              <div className="fail">File upload unsuccessful</div>
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
              <th style={{ width: "30%" }}>Name</th>
              <th style={{ width: "70%" }}>Address</th>
            </tr>
          </TableHead>

          <TableBody style={{ minHeight: "10rem", overflow: "auto" }}>
            {csvData.map(({ firstName, address }) =>
              renderCsvRow({
                firstName,
                address,
              })
            )}
          </TableBody>
        </Table>

        {!invalidCsvData ? (
          <React.Fragment>
            <div>
              <TeamSelectionTitle>Choose Team</TeamSelectionTitle>
              <TeamSelection>
                <Select
                  name="team"
                  required={`Team is required`}
                  width="20rem"
                  options={[
                    ...allTeams.map(({ departmentId, name }) => ({
                      value: departmentId,
                      label: name,
                    })),
                    {
                      value: ADD_TEAM_VALUE,
                      label: (
                        <div className="text-primary text-bold">Add Team</div>
                      ),
                    },
                  ]}
                  placeholder={`Select Team...`}
                  defaultValue={null}
                  value={selectedTeam}
                  onChange={onTeamChange}
                  styles={inputStyles}
                />
                {selectedTeam?.value === ADD_TEAM_VALUE ? (
                  <Input
                    type="text"
                    name="teamName"
                    required={`Team Name is required`}
                    placeholder="Enter Team Name"
                    style={{ width: "18rem" }}
                    value={teamName}
                    onChange={({ target: { value } }) => setTeamName(value)}
                  />
                ) : null}
                {selectedTeam ? (
                  <Select
                    name="token"
                    className="basic-single"
                    classNamePrefix="select"
                    width="18rem"
                    options={tokensDropdown}
                    isSearchable
                    isLoading={loadingTokenList}
                    placeholder={`Select Currency...`}
                    isDisabled={selectedTeam.value !== ADD_TEAM_VALUE}
                    defaultValue={null}
                    value={teamToken}
                    onChange={setTeamToken}
                    styles={inputStyles}
                    filterOption={createFilter({ ignoreAccents: false })}
                    components={{ MenuList }}
                  />
                ) : null}
              </TeamSelection>
            </div>
            <div
              className="d-flex justify-content-end"
              style={{ margin: "2rem" }}
            >
              <Button
                type="button"
                width="15rem"
                onClick={onAddBulkTeammates}
                disabled={loading || isReadOnly || !canConfirm}
                loading={loading}
              >
                Confirm
              </Button>
            </div>
          </React.Fragment>
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
      <ModalHeader title={"Upload Gnosis CSV"} toggle={handleHide} />
      <ModalBody width="100rem">{renderAddBulkPeople()}</ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddPeopleFromGnosisModal);
