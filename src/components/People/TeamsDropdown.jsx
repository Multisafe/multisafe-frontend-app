import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { show } from "redux-modal";

import { useDropdown } from "hooks";
import ViewTeamsModal, {
  MODAL_NAME as VIEW_TEAMS_MODAL,
} from "./ViewTeamsModal";
import { Teams } from "./styles";

export default function TeamsDropdown() {
  const { open, toggleDropdown } = useDropdown();
  const dispatch = useDispatch();

  const showTeamsModal = () => {
    dispatch(show(VIEW_TEAMS_MODAL));
  };

  return (
    <Teams onClick={toggleDropdown}>
      <div className="text">Teams</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
      <div className={`teams-dropdown ${open && "show"}`}>
        <div className="teams-option" onClick={showTeamsModal}>
          <div className="name">View All</div>
        </div>
        <div className="teams-option">
          <div className="name">Add Team</div>
        </div>
      </div>
      <ViewTeamsModal />
    </Teams>
  );
}
