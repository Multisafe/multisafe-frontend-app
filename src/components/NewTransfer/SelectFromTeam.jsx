import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Button from "components/common/Button";
import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import viewPeopleSaga from "store/view-people/saga";
import viewPeopleReducer from "store/view-people/reducer";
import { getPeopleByTeam } from "store/view-people/actions";
import {
  makeSelectTeams,
  makeSelectLoading as makeSelectTeamsLoading,
} from "store/view-teams/selectors";
import {
  makeSelectPeopleByTeam,
  makeSelectLoadingPeopleByTeam,
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
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    let dropdownList = [];
    if (allTeams && allTeams.length > 0 && !teamsDropdown) {
      dropdownList = allTeams
        .filter(
          ({ tokenInfo }) =>
            tokenInfo.symbol === selectedToken || tokenInfo.symbol === "USD"
        )
        .map(({ departmentId, name }) => ({
          value: departmentId,
          label: name,
        }));
      setTeamsDropdown(dropdownList);
      setValue("team", dropdownList[0]);
    }
  }, [allTeams, teamsDropdown, selectedToken, setValue]);

  useEffect(() => {
    if (selectedTeamId) {
      dispatch(getPeopleByTeam(ownerSafeAddress, selectedTeamId));
    }
  }, [selectedTeamId, dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (!allTeams) {
      dispatch(getTeams(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, allTeams]);

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
    if (selectedTeamId && teammates) {
      setPeople(teammates);
    } else {
      setPeople();
    }
  }, [selectedTeamId, teammates]);

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

  const selectedCount = useMemo(() => {
    return checked.filter(Boolean).length;
  }, [checked]);

  const renderNoPeopleFound = () => (
    <Table>
      <TableHead>
        <tr>
          <th style={{ width: "30%" }}>Name</th>
          <th style={{ width: "25%" }}>Disbursement</th>
          <th style={{ width: "45%" }}>Address</th>
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
          <Title>Team Details</Title>

          {!loadingTeammates && people.length > 0 && (
            <SelectAll>
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
              <th style={{ width: "30%" }}>Name</th>
              <th style={{ width: "25%" }}>Disbursement</th>
              <th style={{ width: "45%" }}>Address</th>
            </tr>
          </TableHead>
          <TableBody style={{ maxHeight: "25rem", overflow: "auto" }}>
            {loadingTeammates && <TableLoader colSpan={3} height="20rem" />}
            {!loadingTeammates &&
              people.length > 0 &&
              people.map(({ peopleId, data, ...rest }, idx) => {
                const {
                  firstName,
                  lastName,
                  salaryAmount,
                  salaryToken,
                  address,
                } = getDecryptedDetails(data, encryptionKey, organisationType);

                const teammateDetails = {
                  firstName,
                  lastName,
                  salaryToken,
                  salaryAmount,
                  address,
                  peopleId,
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
                    <td style={{ width: "30%" }}>
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
                    <td style={{ width: "25%" }}>
                      <TokenImg token={salaryToken} />
                      <span className="mr-2">
                        {salaryAmount || `0`} {salaryToken}
                      </span>
                    </td>
                    <td style={{ width: "45%" }}>{address}</td>
                  </tr>
                );
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
            <Title>Paying To</Title>
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
