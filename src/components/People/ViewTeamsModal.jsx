import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector, useDispatch } from "react-redux";
import { show as showModal } from "redux-modal";

import { makeSelectLoading, makeSelectTeams } from "store/view-teams/selectors";
import { Table, TableBody, TableInfo } from "components/common/Table";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { getDefaultIconIfPossible } from "constants/index";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import Loading from "components/common/Loading";
import Img from "components/common/Img";
import Button from "components/common/Button";
import PlusIcon from "assets/icons/dashboard/plus-icon.svg";
import { MODAL_NAME as ADD_TEAM_MODAL } from "./AddTeamModal";

export const MODAL_NAME = "view-teams-modal";

function ViewTeamsModal(props) {
  const { show, handleHide } = props;
  const dispatch = useDispatch();

  const loading = useSelector(makeSelectLoading());
  const icons = useSelector(makeSelectTokenIcons());
  const allTeams = useSelector(makeSelectTeams());

  const showAddTeamModal = () => {
    handleHide();
    dispatch(showModal(ADD_TEAM_MODAL));
  };

  const renderTeamRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={3}>
            <div className="d-flex align-items-center justify-content-center mt-5">
              <Loading color="primary" width="3rem" height="3rem" />
            </div>
          </td>
        </tr>
      );
    }

    return (
      allTeams &&
      allTeams.map(({ name, departmentId, employees: peopleCount }) => (
        <tr key={departmentId}>
          <td>{name}</td>
          <td>People: {peopleCount}</td>
          <td>
            Currency:{" "}
            <Img
              src={getDefaultIconIfPossible("DAI", icons)}
              alt={"DAI"}
              width="16"
            />{" "}
            DAI
          </td>
        </tr>
      ))
    );
  };

  const renderTeams = () => {
    return (
      <div style={{ minHeight: "10rem", height: "30rem", overflow: "auto" }}>
        <Table>
          <TableBody>
            <TableInfo
              style={{
                // fontSize: "1.4rem",
                // fontWeight: "900",
                textAlign: "center",
                height: "5rem",
              }}
              onClick={showAddTeamModal}
            >
              <td colSpan={3}>
                <Button iconOnly style={{ color: "#7367f0" }}>
                  <Img src={PlusIcon} alt="plus" className="mr-2" />{" "}
                  <span>Create New Team</span>
                </Button>
              </td>
            </TableInfo>
            {renderTeamRows()}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"All Teams"} toggle={handleHide} />
      <ModalBody width="55rem">{renderTeams()}</ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ViewTeamsModal);
