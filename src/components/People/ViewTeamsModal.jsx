import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector, useDispatch } from "react-redux";
import { show as showModal } from "redux-modal";

import { makeSelectLoading, makeSelectTeams } from "store/view-teams/selectors";
import { Table, TableBody, TableInfo } from "components/common/Table";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import Loading from "components/common/Loading";
import Img from "components/common/Img";
import Button from "components/common/Button";
import PlusIcon from "assets/icons/dashboard/plus-icon.svg";
import { MODAL_NAME as ADD_TEAM_MODAL } from "./AddTeamModal";
import TokenImg from "components/common/TokenImg";

export const MODAL_NAME = "view-teams-modal";

function ViewTeamsModal(props) {
  const { show, handleHide } = props;
  const dispatch = useDispatch();

  const loading = useSelector(makeSelectLoading());
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
      allTeams.map(
        ({ name, departmentId, employees: peopleCount, tokenInfo }) => (
          <tr key={departmentId}>
            <td>{name}</td>
            <td>People: {peopleCount}</td>
            <td>
              Currency: <TokenImg token={tokenInfo.symbol} />
              <span className="mt-1">{tokenInfo.symbol}</span>
            </td>
          </tr>
        )
      )
    );
  };

  const renderTeams = () => {
    return (
      <Table>
        <TableBody
          style={{ minHeight: "10rem", height: "30rem", overflow: "auto" }}
        >
          <TableInfo
            style={{
              textAlign: "center",
              height: "5rem",
            }}
            onClick={showAddTeamModal}
          >
            <td colSpan={3}>
              <Button iconOnly style={{ color: "#1452f5" }}>
                <Img src={PlusIcon} alt="plus" className="mr-2" />{" "}
                <span>Create New Team</span>
              </Button>
            </td>
          </TableInfo>
          {renderTeamRows()}
        </TableBody>
      </Table>
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
