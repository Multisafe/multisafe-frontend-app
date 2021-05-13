import React from "react";
import { useDispatch } from "react-redux";
import { show } from "redux-modal";

import { MODAL_NAME as ADD_TEAM_MODAL } from "./AddTeamModal";
import { Teams } from "./styles";

export default function AddTeamButton() {
  const dispatch = useDispatch();

  const showAddTeamModal = () => {
    dispatch(show(ADD_TEAM_MODAL));
  };

  return (
    <Teams onClick={showAddTeamModal}>
      <div className="text">Add Team</div>
    </Teams>
  );
}
