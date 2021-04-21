import React from "react";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { show } from "redux-modal";
import { useDispatch } from "react-redux";

import { useDropdown } from "hooks";
import DotsIcon from "assets/icons/dashboard/dotted-settings-icon.svg";
import Img from "components/common/Img";
import DeleteTeamModal, {
  MODAL_NAME as DELETE_TEAM_MODAL,
} from "./DeleteTeamModal";
import { ModifyTeam } from "./styles";

export default function ModifyTeamDropdown({ departmentId }) {
  const { open, toggleDropdown } = useDropdown();

  const dispatch = useDispatch();

  const showDeleteTeamModal = () => {
    dispatch(show(DELETE_TEAM_MODAL, { departmentId }));
  };

  return (
    <ModifyTeam onClick={toggleDropdown}>
      <div>
        <Img src={DotsIcon} alt="modify" />
      </div>
      <div className={`modify-team-dropdown ${open && "show"}`}>
        <div className="modify-team-option">
          <FontAwesomeIcon
            icon={faEdit}
            color="#373737"
            className="mr-3"
            style={{ fontSize: "1rem" }}
          />
          <div className="name">Edit</div>
        </div>
        <div className="modify-team-option" onClick={showDeleteTeamModal}>
          <FontAwesomeIcon
            icon={faTrashAlt}
            color="#ff4660"
            className="mr-3"
            style={{ fontSize: "1rem" }}
          />
          <div className="name">Delete</div>
        </div>
      </div>
      <DeleteTeamModal />
    </ModifyTeam>
  );
}
