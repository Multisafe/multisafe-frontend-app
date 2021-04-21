import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector } from "react-redux";

import { makeSelectLoading, makeSelectTeams } from "store/view-teams/selectors";
import { Table, TableHead, TableBody } from "components/common/Table";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { getDefaultIconIfPossible } from "constants/index";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import Loading from "components/common/Loading";

export const MODAL_NAME = "view-teams-modal";

function ViewTeamsModal(props) {
  const { show, handleHide } = props;

  const loading = useSelector(makeSelectLoading());
  const icons = useSelector(makeSelectTokenIcons());
  const allTeams = useSelector(makeSelectTeams());
  console.log({ allTeams });

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
          <td>{peopleCount}</td>
          <td>
            <img
              src={getDefaultIconIfPossible("DAI", icons)}
              alt={"DAI"}
              width="16"
              className="mr-2"
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
          <TableHead>
            <tr>
              <th style={{ width: "33%" }}>Team Name</th>
              <th style={{ width: "33%" }}>No. of People</th>
              <th style={{ width: "33%" }}>Currency</th>
            </tr>
          </TableHead>

          <TableBody>{renderTeamRows()}</TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader
        style={{ borderBottom: "none" }}
        title={"All Teams"}
        toggle={handleHide}
      />
      <ModalBody width="55rem">{renderTeams()}</ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(ViewTeamsModal);
