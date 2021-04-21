import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import { useDropdown } from "hooks";
import { SearchByTeam } from "./styles";
import { makeSelectTeams } from "store/view-teams/selectors";
import {
  addPeopleFilter,
  removePeopleFilter,
  setSearchName,
} from "store/view-people/actions";
import { PEOPLE_FILTERS } from "store/view-people/constants";
import { makeSelectTeamFilter } from "store/view-people/selectors";

export default function SearchByTeamDropdown() {
  const { open, toggleDropdown } = useDropdown();
  const dispatch = useDispatch();

  const allTeams = useSelector(makeSelectTeams());
  const teamFilter = useSelector(makeSelectTeamFilter());

  const selectTeam = (name) => {
    if (name) {
      // if team is selected, clear name search
      dispatch(setSearchName(""));
      dispatch(addPeopleFilter(PEOPLE_FILTERS.TEAM, name));
    } else {
      dispatch(removePeopleFilter(PEOPLE_FILTERS.TEAM));
    }
  };

  return (
    <SearchByTeam onClick={toggleDropdown} className={`${open && "highlight"}`}>
      <div className="text">{teamFilter || "All Teams"}</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#373737" />
      <div className={`search-team-dropdown ${open && "show"}`}>
        <div className="search-team-option" onClick={() => selectTeam("")}>
          <div className="name">All Teams</div>
        </div>
        {allTeams &&
          allTeams.map(({ name, departmentId }) => (
            <div
              className="search-team-option"
              key={departmentId}
              onClick={() => selectTeam(name)}
            >
              <div className="name">{name}</div>
            </div>
          ))}
      </div>
    </SearchByTeam>
  );
}
