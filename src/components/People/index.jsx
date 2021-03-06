import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { show } from "redux-modal";

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
import ControlledInput from "components/common/Input";
import AddTeamButton from "./AddTeamButton";
import AddPeopleDropdown from "./AddPeopleDropdown";
import SearchByTeamDropdown from "./SearchByTeamDropdown";
import ExportButton from "./ExportButton";
import Button from "components/common/Button";
import Avatar from "components/common/Avatar";
import {
  Table,
  TableHead,
  TableBody,
  TableTitle,
  TableInfo,
  TableLoader,
} from "components/common/Table";
import { InfoCard, TeamContainer } from "./styles";
import { useEncryptionKey } from "hooks";
import { getDecryptedDetails } from "utils/encryption";
import Img from "components/common/Img";
import { togglePeopleDetails, setPeopleDetails } from "store/layout/actions";
import DeletePeopleModal from "./DeletePeopleModal";
import AddPeopleIcon from "assets/icons/dashboard/empty/people.svg";
import ModifyTeamDropdown from "./ModifyTeamDropdown";
import {
  makeSelectTeamIdToDetailsMap,
  makeSelectTeams,
} from "store/view-teams/selectors";
import AddBulkPeoplModal from "./AddBulkPeopleModal";
import AddSinglePeopleModal, {
  MODAL_NAME as ADD_SINGLE_MODAL,
} from "./AddSinglePeopleModal";
import TokenImg from "components/common/TokenImg";
import DeleteTeamModal from "./DeleteTeamModal";
import AddTeamModal from "./AddTeamModal";
import ViewTeamsModal from "./ViewTeamsModal";
import { formatNumber } from "utils/number-helpers";
import { constructLabel } from "utils/tokens";

const viewTeamsKey = "viewTeams";
const viewPeopleKey = "viewPeople";

export default function People() {
  const [encryptionKey] = useEncryptionKey();

  const [isNewUser, setIsNewUser] = useState();
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
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const encryptedPeople = useSelector(makeSelectPeople());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isNameFilterApplied = useSelector(
    makeSelectIsSearchByNameFilterApplied()
  );
  const isTeamFilterApplied = useSelector(
    makeSelectIsSearchByTeamFilterApplied()
  );
  const nameFilter = useSelector(makeSelectNameFilter());
  const teamFilter = useSelector(makeSelectTeamFilter());
  const searchPeopleValue = useSelector(makeSelectSearchName());
  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getTeams(safeAddress));
      dispatch(getAllPeople(safeAddress));
    }
  }, [dispatch, safeAddress]);

  useEffect(() => {
    if (
      (encryptedPeople && encryptedPeople.length > 0) ||
      (allTeams && allTeams.length > 0)
    ) {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  }, [encryptedPeople, allTeams]);

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
    if (encryptedPeople && allTeams && !loadingPeople) {
      const sortedDecryptedPeople = encryptedPeople
        .map(({ data, ...rest }) => {
          const { firstName, lastName, salaryAmount, salaryToken, address } =
            getDecryptedDetails(data, encryptionKey, organisationType);
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
          a.firstName &&
          b.firstName &&
          a.firstName.toUpperCase() > b.firstName.toUpperCase()
            ? 1
            : -1
        );

      setAllPeople(sortedDecryptedPeople);

      const peopleByTeam = allTeams.reduce((accumulator, { name }) => {
        accumulator[name] = [];
        return accumulator;
      }, {});

      for (let i = 0; i < sortedDecryptedPeople.length; i++) {
        const people = sortedDecryptedPeople[i];
        if (peopleByTeam[people.departmentName]) {
          peopleByTeam[people.departmentName].push(people);
        }
      }

      setPeopleByTeam(peopleByTeam);
    }
  }, [
    encryptedPeople,
    encryptionKey,
    organisationType,
    allTeams,
    loadingPeople,
  ]);

  const openSidebar = (peopleDetails) => {
    dispatch(togglePeopleDetails(true));
    dispatch(setPeopleDetails(peopleDetails));
  };

  const showAddPeopleModal = (departmentId, departmentName) => {
    const { tokenInfo } = teamIdToDetailsMap[departmentId];
    dispatch(
      show(ADD_SINGLE_MODAL, {
        departmentId,
        departmentName,
        defaultValues: {
          team: { value: departmentId, label: departmentName },
          token: {
            value: tokenInfo.symbol,
            label: constructLabel({
              token: tokenInfo.symbol,
              imgUrl: tokenInfo.logoURI,
            }),
          },
        },
      })
    );
  };

  const renderNoPeopleFound = () => {
    return (
      <TableInfo
        style={{
          fontSize: "1.4rem",
          fontWeight: "500",
          textAlign: "center",
          height: "10rem",
        }}
      >
        <td colSpan={4}>No people found!</td>
      </TableInfo>
    );
  };

  const renderAddPeopleText = (teamName) => (
    <div className="d-flex align-items-center justify-content-center">
      <Button
        className="secondary p-0"
        width="10rem"
        onClick={() => showAddPeopleModal(teamNameToIdMap[teamName], teamName)}
      >
        Add People
      </Button>
    </div>
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
        <div className="mt-4">Start by adding some teams and people!</div>
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
      <td style={{ width: "25%" }}>
        <div className="d-flex align-items-center">
          <Avatar className="mr-3" firstName={firstName} lastName={lastName} />
          <div>
            {firstName} {lastName}
          </div>
        </div>
      </td>
      <td style={{ width: "20%" }}>{departmentName}</td>
      <td style={{ width: "20%" }}>
        {salaryAmount && (
          <React.Fragment>
            <TokenImg token={salaryToken} />
            <span>
              {formatNumber(salaryAmount, 5)} {salaryToken}
            </span>
          </React.Fragment>
        )}
      </td>
      <td style={{ width: "35%" }}>{address}</td>
    </tr>
  );

  // const renderPeopleByAlphabet = () => {
  //   return peopleByAlphabet && Object.keys(peopleByAlphabet).length > 0
  //     ? Object.keys(peopleByAlphabet).map((alphabet) => (
  //         <React.Fragment key={alphabet}>
  //           <TableTitle>{alphabet}</TableTitle>
  //           {peopleByAlphabet[alphabet].map((people) => renderRow(people))}
  //         </React.Fragment>
  //       ))
  //     : renderNoPeopleFound();
  // };

  const renderPeopleByTeam = () => {
    if (!peopleByTeam) return null;
    return Object.keys(peopleByTeam).map((team) => (
      <React.Fragment key={team}>
        <TableTitle
          style={{ height: "6rem", overflow: "visible" }}
          className="position-relative"
        >
          <TeamContainer>
            <div>{team}</div>
            <div className="d-flex align-items-center">
              {!peopleByTeam[team].length && (
                <div className="mr-3">{renderAddPeopleText(team)}</div>
              )}

              <ModifyTeamDropdown
                departmentId={teamNameToIdMap && teamNameToIdMap[team]}
              />
            </div>
          </TeamContainer>
        </TableTitle>
        {peopleByTeam[team].map((people) => renderRow(people))}
      </React.Fragment>
    ));
  };

  const renderFilteredPeopleByTeam = () => {
    return (
      <React.Fragment>
        <TableTitle
          style={{ height: "6rem", overflow: "visible" }}
          className="position-relative"
        >
          <TeamContainer>
            <div>{teamFilter}</div>
            <div className="d-flex align-items-center">
              {peopleByTeam && !peopleByTeam[teamFilter].length && (
                <div className="mr-3">{renderAddPeopleText(teamFilter)}</div>
              )}

              <ModifyTeamDropdown
                departmentId={teamNameToIdMap && teamNameToIdMap[teamFilter]}
              />
            </div>
          </TeamContainer>
        </TableTitle>

        {peopleByTeam &&
        peopleByTeam[teamFilter] &&
        peopleByTeam[teamFilter].length > 0
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
      return <TableLoader colSpan={4} height="30rem" />;
    }

    if (isNewUser) {
      return renderAddPeople();
    }

    // existing user
    if (isNameFilterApplied) return renderFilteredPeopleByName();
    else if (isTeamFilterApplied) return renderFilteredPeopleByTeam();
    // return renderPeopleByAlphabet();
    return renderPeopleByTeam();
  };

  return (
    <div>
      <InfoCard>
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
      </InfoCard>
      <InfoCard className="mt-3">
        <div>
          <div className="title mb-0">
            {!isNewUser &&
              allPeople &&
              allPeople.length > 0 &&
              `Showing ${allPeople.length} people`}
          </div>
        </div>
        <div className="flex">
          <AddTeamButton />
          <AddPeopleDropdown />
          <SearchByTeamDropdown />
          <ExportButton />
        </div>
      </InfoCard>
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
      <AddSinglePeopleModal />
      <AddBulkPeoplModal />
      <DeletePeopleModal />
      <DeleteTeamModal />
      <AddTeamModal />
      <ViewTeamsModal />
    </div>
  );
}
