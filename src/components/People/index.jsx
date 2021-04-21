import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import viewPeopleReducer from "store/view-people/reducer";
import {
  getAllPeople,
  addPeopleFilter,
  removePeopleFilter,
  setSearchName,
} from "store/view-people/actions";
import { PEOPLE_FILTERS } from "store/view-people/constants";
import viewPeopleSaga from "store/view-people/saga";
import {
  makeSelectPeople,
  makeSelectLoading as makeSelectLoadingPeople,
  makeSelectIsSearchByTeamFilterApplied,
  makeSelectIsSearchByNameFilterApplied,
  makeSelectNameFilter,
  makeSelectTeamFilter,
  makeSelectSearchName,
} from "store/view-people/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import Loading from "components/common/Loading";

import ControlledInput from "components/common/Input";
import TeamsDropdown from "./TeamsDropdown";
import AddPeopleDropdown from "./AddPeopleDropdown";
import SearchByTeamDropdown from "./SearchByTeamDropdown";
import ExportButton from "./ExportButton";
import Avatar from "components/common/Avatar";
import {
  Table,
  TableHead,
  TableBody,
  TableTitle,
  TableInfo,
} from "components/common/Table";
import { FiltersCard } from "./styles";
import { useLocalStorage } from "hooks";
import { getDecryptedDetails } from "utils/encryption";
import Img from "components/common/Img";
import { getDefaultIconIfPossible } from "constants/index";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import { togglePeopleDetails, setPeopleDetails } from "store/layout/actions";
import DeletePeopleModal from "./DeletePeopleModal";
import AddPeopleIcon from "assets/icons/dashboard/add-people-icon.svg";
import ModifyTeamDropdown from "./ModifyTeamDropdown";
import { makeSelectTeams } from "store/view-teams/selectors";

const viewTeamsKey = "viewTeams";
const viewPeopleKey = "viewPeople";

export default function People() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const [isNewUser, setIsNewUser] = useState();
  const [peopleByAlphabet, setPeopleByAlphabet] = useState();
  const [allPeople, setAllPeople] = useState();
  const [peopleByTeam, setPeopleByTeam] = useState();
  const [filteredPeople, setFilteredPeople] = useState();
  const [teamNameToIdMap, setTeamNameToIdMap] = useState();

  useInjectReducer({
    key: viewTeamsKey,
    reducer: viewTeamsReducer,
  });
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });

  useInjectSaga({ key: viewTeamsKey, saga: viewTeamsSaga });
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });

  const dispatch = useDispatch();
  const allTeams = useSelector(makeSelectTeams());
  const loadingPeople = useSelector(makeSelectLoadingPeople());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const encryptedPeople = useSelector(makeSelectPeople());
  const organisationType = useSelector(makeSelectOrganisationType());
  const icons = useSelector(makeSelectTokenIcons());
  const isNameFilterApplied = useSelector(
    makeSelectIsSearchByNameFilterApplied()
  );
  const isTeamFilterApplied = useSelector(
    makeSelectIsSearchByTeamFilterApplied()
  );
  const nameFilter = useSelector(makeSelectNameFilter());
  const teamFilter = useSelector(makeSelectTeamFilter());
  const searchPeopleValue = useSelector(makeSelectSearchName());

  useEffect(() => {
    dispatch(getTeams(ownerSafeAddress));
    dispatch(getAllPeople(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (!encryptedPeople) {
      setIsNewUser(true);
    } else {
      setIsNewUser(false);
    }
  }, [encryptedPeople]);

  useEffect(() => {
    if (!searchPeopleValue && isNameFilterApplied) {
      dispatch(removePeopleFilter(PEOPLE_FILTERS.NAME));
    }

    if (searchPeopleValue) {
      dispatch(
        addPeopleFilter(PEOPLE_FILTERS.NAME, searchPeopleValue.toLowerCase())
      );
    }
  }, [dispatch, searchPeopleValue, isNameFilterApplied]);

  useEffect(() => {
    if (allPeople && nameFilter) {
      const filteredPeople = allPeople.filter(({ firstName, lastName }) =>
        `${firstName} ${lastName}`.toLowerCase().includes(nameFilter)
      );

      setFilteredPeople(filteredPeople);
    }
  }, [allPeople, nameFilter]);

  const handleSearchPeople = (e) => {
    dispatch(setSearchName(e.target.value));
  };

  useEffect(() => {
    if (allTeams && allTeams.length > 0) {
      const teamNameToIdMap = allTeams.reduce((map, { departmentId, name }) => {
        map[name] = departmentId;
        return map;
      }, {});
      setTeamNameToIdMap(teamNameToIdMap);
    }
  }, [allTeams]);

  useEffect(() => {
    if (encryptedPeople && encryptedPeople.length > 0 && encryptionKey) {
      const sortedDecryptedPeople = encryptedPeople
        .map(({ data, ...rest }) => {
          const {
            firstName,
            lastName,
            salaryAmount,
            salaryToken,
            address,
          } = getDecryptedDetails(data, encryptionKey, organisationType);
          return {
            firstName,
            lastName,
            salaryAmount,
            salaryToken,
            address,
            ...rest,
          };
        })
        .sort((a, b) =>
          a.firstName.toUpperCase() > b.firstName.toUpperCase() ? 1 : -1
        );

      setAllPeople(sortedDecryptedPeople);

      const peopleByAlphabet = sortedDecryptedPeople.reduce(
        (accumulator, people) => {
          const alphabet = people.firstName[0].toUpperCase();
          if (!accumulator[alphabet]) {
            accumulator[alphabet] = [people];
          } else {
            accumulator[alphabet].push(people);
          }

          return accumulator;
        },
        {}
      );

      setPeopleByAlphabet(peopleByAlphabet);

      const peopleByTeam = sortedDecryptedPeople.reduce(
        (accumulator, people) => {
          const departmentName = people.departmentName;
          if (!accumulator[departmentName]) {
            accumulator[departmentName] = [people];
          } else {
            accumulator[departmentName].push(people);
          }

          return accumulator;
        },
        {}
      );

      setPeopleByTeam(peopleByTeam);
    }
  }, [encryptedPeople, encryptionKey, organisationType]);

  const openSidebar = (peopleDetails) => {
    dispatch(togglePeopleDetails(true));
    dispatch(setPeopleDetails(peopleDetails));
  };

  const renderNoPeopleFound = () => (
    <TableInfo
      style={{
        fontSize: "1.4rem",
        fontWeight: "500",
        textAlign: "center",
        height: "40rem",
      }}
    >
      <td colSpan={4}>No results found!</td>
    </TableInfo>
  );

  const renderLoading = () => (
    <TableInfo
      style={{
        textAlign: "center",
        height: "40rem",
      }}
    >
      <td colSpan={4}>
        <div className="d-flex align-items-center justify-content-center">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      </td>
    </TableInfo>
  );

  const renderAddPeople = () => (
    <TableInfo
      style={{
        fontSize: "1.6rem",
        fontWeight: "900",
        textAlign: "center",
        height: "40rem",
        color: "#8b8b8b",
      }}
    >
      <td colSpan={4}>
        <Img src={AddPeopleIcon} alt="add-people" />
        <div className="mt-4">Start by adding some people!</div>
      </td>
    </TableInfo>
  );

  const renderRow = ({
    firstName,
    lastName,
    departmentName,
    departmentId,
    peopleId,
    salaryAmount,
    salaryToken,
    address,
  }) => (
    <tr
      key={peopleId}
      onClick={() =>
        openSidebar({
          firstName,
          lastName,
          departmentName,
          departmentId,
          peopleId,
          salaryAmount,
          salaryToken,
          address,
        })
      }
    >
      <td className="d-flex align-items-center">
        <Avatar className="mr-3" firstName={firstName} lastName={lastName} />
        <div>
          {firstName} {lastName}
        </div>
      </td>
      <td style={isTeamFilterApplied ? { color: "#dddcdc" } : {}}>
        {departmentName}
      </td>
      <td>
        <Img
          src={getDefaultIconIfPossible(salaryToken, icons)}
          alt="token"
          className="mr-1"
          width="16"
        />{" "}
        <span>
          {salaryAmount} {salaryToken}
        </span>
      </td>
      <td>{address}</td>
    </tr>
  );

  const renderPeopleByAlphabet = () => {
    return peopleByAlphabet && Object.keys(peopleByAlphabet).length > 0
      ? Object.keys(peopleByAlphabet).map((alphabet) => (
          <React.Fragment key={alphabet}>
            <TableTitle>{alphabet}</TableTitle>
            {peopleByAlphabet[alphabet].map((people) => renderRow(people))}
          </React.Fragment>
        ))
      : renderNoPeopleFound();
  };

  const renderFilteredPeopleByTeam = () => {
    return (
      <React.Fragment>
        <TableTitle>
          <div className="d-flex justify-content-between align-items-center">
            <div>{teamFilter}</div>
            <ModifyTeamDropdown
              departmentId={teamNameToIdMap && teamNameToIdMap[teamFilter]}
            />
          </div>
        </TableTitle>
        {peopleByTeam && peopleByTeam[teamFilter].length > 0
          ? peopleByTeam[teamFilter].map((people) => renderRow(people))
          : renderNoPeopleFound()}
      </React.Fragment>
    );
  };

  const renderFilteredPeopleByName = () => {
    return filteredPeople && filteredPeople.length > 0
      ? filteredPeople.map((people) => renderRow(people))
      : renderNoPeopleFound();
  };

  const renderTableContent = () => {
    if (loadingPeople) {
      return renderLoading();
    }

    if (isNewUser) {
      return renderAddPeople();
    }

    // existing user
    if (isNameFilterApplied) return renderFilteredPeopleByName();
    else if (isTeamFilterApplied) return renderFilteredPeopleByTeam();
    return renderPeopleByAlphabet();
  };

  const renderForNormalUser = () => {
    return (
      <div>
        <FiltersCard>
          <div>
            <div className="title">People</div>
            <div className="subtitle">Manage teams and people here</div>
          </div>
          <div>
            <ControlledInput
              type="text"
              id="search-people"
              name="search-people"
              placeholder={"Search for people"}
              onChange={handleSearchPeople}
              value={searchPeopleValue}
            />
          </div>
        </FiltersCard>
        <FiltersCard className="mt-3">
          <div>
            <div className="title mb-0">
              {!isNewUser &&
                `Showing ${allPeople ? allPeople.length : 0} people`}
            </div>
          </div>
          <div className="flex">
            <TeamsDropdown />
            <AddPeopleDropdown />
            <SearchByTeamDropdown />
            <ExportButton />
          </div>
        </FiltersCard>
        <Table style={{ marginTop: "3rem" }}>
          <TableHead>
            <tr>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "20%" }}>Team</th>
              <th style={{ width: "20%" }}>Disbursement</th>
              <th style={{ width: "35%" }}>Address</th>
            </tr>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
        <DeletePeopleModal />
      </div>
    );
  };

  return <div>{renderForNormalUser()}</div>;
}
