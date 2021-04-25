import React from "react";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { show } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import { useDropdown } from "hooks";
import DotsIcon from "assets/icons/dashboard/dotted-settings-icon.svg";
import Img from "components/common/Img";
import { MODAL_NAME as DELETE_TEAM_MODAL } from "./DeleteTeamModal";
import { MODAL_NAME as EDIT_TEAM_MODAL } from "./AddTeamModal";
import { ModifyTeam } from "./styles";
import { makeSelectTeamIdToDetailsMap } from "store/view-teams/selectors";
import { constructLabel } from "utils/tokens";

export default function ModifyTeamDropdown({ departmentId }) {
  const { open, toggleDropdown } = useDropdown();

  const dispatch = useDispatch();

  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());

  const showDeleteTeamModal = () => {
    dispatch(show(DELETE_TEAM_MODAL, { departmentId }));
  };

  const showEditTeamModal = () => {
    const { name, tokenInfo } = teamIdToDetailsMap[departmentId];
    dispatch(
      show(EDIT_TEAM_MODAL, {
        departmentId,
        isEditMode: true,
        defaultValues: {
          name,
          token: {
            value: tokenInfo.symbol,
            label: constructLabel(tokenInfo.symbol, tokenInfo.logoURI),
          },
        },
      })
    );
  };

  return (
    <ModifyTeam onClick={toggleDropdown}>
      <div>
        <Img src={DotsIcon} alt="modify" />
      </div>
      <div className={`modify-team-dropdown ${open && "show"}`}>
        <div className="modify-team-option" onClick={showEditTeamModal}>
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
    </ModifyTeam>
  );
}
