import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { show } from "redux-modal";
import { useDispatch } from "react-redux";

import { useDropdown } from "hooks";
import { MODAL_NAME as ADD_BULK_MODAL } from "./AddBulkPeopleModal";
import { MODAL_NAME as ADD_SINGLE_MODAL } from "./AddSinglePeopleModal";
import { MODAL_NAME as ADD_GNOSIS_MODAL } from "./AddPeopleFromGnosisModal";
import { AddPeople } from "./styles";

export default function AddPeopleDropdown() {
  const { open, toggleDropdown } = useDropdown();

  const dispatch = useDispatch();

  const showAddSingleModal = () => {
    dispatch(show(ADD_SINGLE_MODAL));
  };

  const showBulkAddModal = () => {
    dispatch(show(ADD_BULK_MODAL));
  };

  const showGnosisModal = () => {
    dispatch(show(ADD_GNOSIS_MODAL));
  };

  return (
    <AddPeople onClick={toggleDropdown}>
      <div className="text">Add People</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
      <div className={`add-people-dropdown ${open && "show"}`}>
        <div className="add-people-option" onClick={showAddSingleModal}>
          <div className="name">Add One</div>
        </div>
        <div className="add-people-option" onClick={showBulkAddModal}>
          <div className="name">Import Multiple</div>
        </div>
        <div className="add-people-option" onClick={showGnosisModal}>
          <div className="name">Import from Gnosis</div>
        </div>
      </div>
    </AddPeople>
  );
}
