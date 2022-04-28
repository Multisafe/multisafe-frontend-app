import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Button from "components/common/Button";
import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import viewPeopleSaga from "store/view-people/saga";
import viewPeopleReducer from "store/view-people/reducer";
import { getPeopleByTeam, getAllPeople } from "store/view-people/actions";
import {
  makeSelectTeams,
  makeSelectLoading as makeSelectTeamsLoading,
} from "store/view-teams/selectors";
import {
  makeSelectPeopleByTeam,
  makeSelectLoadingPeopleByTeam,
  makeSelectPeople,
  makeSelectLoading,
} from "store/view-people/selectors";
import { getInvitations } from "store/invitation/actions";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useEncryptionKey } from "hooks";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
} from "store/global/selectors";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
  TableLoader,
} from "components/common/Table";
import TokenImg from "components/common/TokenImg";
import { getDecryptedDetails } from "utils/encryption";
import { Select } from "components/common/Form";
import CheckBox from "components/common/CheckBox";
import {
  SelectFromTeamContainer,
  OuterFlex,
  Title,
  SelectAll,
  ConfirmContainer,
  TableTitle,
  SearchNameInput,
} from "./styles/SelectFromTeam";

// reducer/saga keys
const viewPeopleKey = "viewPeople";
const viewTeamsKey = "viewTeams";

export default function SelectFromTeam(props) {
  const [encryptionKey] = useEncryptionKey();
  const { handleSubmit, control, watch, setValue } = useForm({
    mode: "onChange",
  });

  const { handleHide, selectedToken, setPeopleFromTeam } = props;

  const selectedTeamId = watch("team") && watch("team").value;

  const [checked, setChecked] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [people, setPeople] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [teamsDropdown, setTeamsDropdown] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  // Reducers
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });
  useInjectReducer({ key: viewTeamsKey, reducer: viewTeamsReducer });

  // Sagas
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });
  useInjectSaga({ key: viewTeamsKey, saga: viewTeamsSaga });

  const dispatch = useDispatch();

  // Selectors
  const allTeams = useSelector(makeSelectTeams());
  const loadingTeams = useSelector(makeSelectTeamsLoading());
  const loadingTeammates = useSelector(makeSelectLoadingPeopleByTeam());
  const teammates = useSelector(makeSelectPeopleByTeam());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const allPeople = useSelector(makeSelectPeople());
  const loadingAllPeople = useSelector(makeSelectLoading());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getInvitations(safeAddress));
      dispatch(getAllPeople(safeAddress));
    }
  }, [safeAddress, dispatch]);

  useEffect(() => {
    if (allTeams && allTeams.length > 0 && !teamsDropdown) {
      const dropdownList = allTeams
        // .filter(
        //   ({ tokenInfo }) =>
        //     tokenInfo.symbol === selectedToken || tokenInfo.symbol === "USD"
        // )
        .map(({ departmentId, name }) => ({
          value: departmentId,
          label: name,
        }));

      dropdownList.unshift({ value: "all", label: "All Teams" });
      setTeamsDropdown(dropdownList);
      setValue("team", dropdownList[0]);
    }
  }, [allTeams, teamsDropdown, selectedToken, setValue]);

  useEffect(() => {
    if (selectedTeamId && selectedTeamId !== "all") {
      dispatch(getPeopleByTeam(safeAddress, selectedTeamId));
    }
  }, [selectedTeamId, dispatch, safeAddress]);

  useEffect(() => {
    if (!allTeams) {
      dispatch(getTeams(safeAddress));
    }
  }, [dispatch, safeAddress, allTeams]);

  useEffect(() => {
    // reset to initial state
    setSelectedRows([]);
    setChecked([]);
    setIsCheckedAll(false);
  }, [selectedTeamId]);

  useEffect(() => {
    if (people && people.length > 0) {
      setChecked(new Array(people.length).fill(false));
    }
  }, [people]);

  useEffect(() => {
    if (selectedTeamId === "all" && allPeople) {
      setPeople(allPeople);
    } else if (selectedTeamId && teammates) {
      setPeople(teammates);
    } else {
      setPeople();
    }
  }, [selectedTeamId, teammates, allPeople]);

  const onSubmit = async () => {
    if (!selectedRows) return;

    setPeopleFromTeam(selectedRows);
    handleHide();
  };

  const handleCheckAll = () => {
    if (checked.length === people.length && checked.every((check) => check)) {
      // if all are checked, deselect all
      setIsCheckedAll(false);
      setSelectedRows([]);
      setChecked([]);
    } else {
      // select all
      setChecked(new Array(people.length).fill(true));
      setIsCheckedAll(true);
      if (people && people.length > 0) {
        const allRows = people.map(({ data, peopleId, ...rest }, index) => ({
          peopleId,
          ...getDecryptedDetails(data, encryptionKey, organisationType),
          index,
          ...rest,
        }));
        setSelectedRows(allRows);
      }
    }
  };

  const handleChecked = (teammateDetails, index) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);

    if (
      newChecked.length === people.length &&
      newChecked.every((check) => check)
    ) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
    // if checked, push the details, provided it doesn't already exist in the array
    // else remove the unselected details from the array
    if (
      newChecked[index] &&
      !selectedRows.some((row) => row.peopleId === teammateDetails.peopleId)
    ) {
      setSelectedRows([...selectedRows, teammateDetails]);
    } else {
      setSelectedRows(
        selectedRows.filter((row) => row.peopleId !== teammateDetails.peopleId)
      );
    }
  };

  const onSearchQueryChange = (e) => {
    setSearchQuery(e?.target?.value || "");
  };

  const selectedCount = useMemo(() => {
    return checked.filter(Boolean).length;
  }, [checked]);

  const renderNoPeopleFound = () => (
    <Table>
      <TableHead>
        <tr>
          <th style={{ width: "25%" }}>Name</th>
          <th style={{ width: "20%" }}>Team</th>
          <th style={{ width: "15%" }}>Disbursement</th>
          <th style={{ width: "40%" }}>Address</th>
        </tr>
      </TableHead>
      <TableBody style={{ maxHeight: "25rem", overflow: "auto" }}>
        <TableInfo
          style={{
            fontSize: "1.4rem",
            fontWeight: "500",
            textAlign: "center",
            height: "20rem",
          }}
        >
          <td colSpan={4}>No people found!</td>
        </TableInfo>
      </TableBody>
    </Table>
  );

  const renderPayTable = () => {
    if (!people) return renderNoPeopleFound();

    return (
      <div>
        <OuterFlex>
          <TableTitle>Team Details</TableTitle>

          {!loadingTeammates && people.length > 0 && (
            <SelectAll>
              <SearchNameInput
                type="text"
                name="search"
                placeholder="Search Teammates"
                value={searchQuery}
                onChange={onSearchQueryChange}
              />
              <CheckBox
                type="checkbox"
                id="allCheckbox"
                checked={isCheckedAll}
                onChange={handleCheckAll}
                label={`Select All`}
              />
            </SelectAll>
          )}
        </OuterFlex>
        <Table>
          <TableHead>
            <tr>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "20%" }}>Team</th>
              <th style={{ width: "15%" }}>Disbursement</th>
              <th style={{ width: "40%" }}>Address</th>
            </tr>
          </TableHead>
          <TableBody style={{ maxHeight: "25rem", overflow: "auto" }}>
            {(loadingTeammates || loadingAllPeople) && (
              <TableLoader colSpan={3} height="20rem" />
            )}
            {!loadingTeammates &&
              people.length > 0 &&
              people.map(({ peopleId, data, departmentName, ...rest }, idx) => {
                const {
                  firstName = "",
                  lastName = "",
                  salaryAmount,
                  salaryTokenAddress,
                  salaryToken,
                  address,
                } = getDecryptedDetails(data, encryptionKey, organisationType);

                const lowerCaseFirstName = firstName.toLowerCase();
                const lowerCaseLastName = lastName.toLowerCase();
                const lowerCaseSearchQuery = searchQuery.toLowerCase();

                if (
                  lowerCaseFirstName.includes(lowerCaseSearchQuery) ||
                  lowerCaseLastName.includes(lowerCaseSearchQuery)
                ) {
                  const teammateDetails = {
                    firstName,
                    lastName,
                    salaryToken,
                    salaryAmount,
                    address,
                    peopleId,
                    departmentName,
                    index: idx,
                    ...rest,
                  };
                  return (
                    <tr
                      key={`${address}-${idx}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChecked(teammateDetails, idx);
                      }}
                      style={{
                        backgroundColor: checked[idx] ? "#e7eefe" : "#fff",
                      }}
                    >
                      <td style={{ width: "25%" }}>
                        <div className="d-flex align-items-center">
                          <CheckBox
                            type="checkbox"
                            id={`checkbox${idx}`}
                            name={`checkbox${idx}`}
                            checked={checked[idx] || false}
                            onChange={() => handleChecked(teammateDetails, idx)}
                          />
                          <div>
                            {firstName} {lastName}
                          </div>
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>{departmentName}</td>
                      <td style={{ width: "15%" }}>
                        <TokenImg
                          token={salaryToken}
                          address={salaryTokenAddress}
                        />
                        <span className="mr-2">
                          {salaryAmount || `0`} {salaryToken}
                        </span>
                      </td>
                      <td style={{ width: "40%" }}>{address}</td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <SelectFromTeamContainer>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <Title>Choose Team</Title>
            <Select
              name="team"
              control={control}
              required={`Team is required`}
              width="18rem"
              options={teamsDropdown}
              isLoading={loadingTeams}
              placeholder={`Select Team...`}
              defaultValue={null}
            />
          </div>

          {renderPayTable()}

          <ConfirmContainer>
            <Button
              type="submit"
              width="16rem"
              className="ml-auto mt-3"
              disabled={!selectedCount}
            >
              Confirm
            </Button>
          </ConfirmContainer>
        </form>
      </div>
    </SelectFromTeamContainer>
  );
}
