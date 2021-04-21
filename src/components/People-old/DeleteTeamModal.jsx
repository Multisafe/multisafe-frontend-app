import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import TeamPng from "assets/images/user-team.png";
import Button from "components/common/Button";
import { deleteDepartment } from "store/add-department/actions";
import { Title, Heading, Summary } from "./styles";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectUpdating } from "store/add-department/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import addDepartmentReducer from "store/add-department/reducer";
import addDepartmentSaga from "store/add-department/saga";

export const MODAL_NAME = "delete-team-modal";
const addDepartmentKey = "addDepartment";

const modalStyles = `
  .modal-content {
    border-radius: 20px;
    border: none;
    padding: 20px;
  }
`;

function DeleteTeamModal(props) {
  const { show, handleHide, departmentName, departmentId } = props;

  useInjectReducer({ key: addDepartmentKey, reducer: addDepartmentReducer });

  useInjectSaga({ key: addDepartmentKey, saga: addDepartmentSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());

  const confirmDelete = () => {
    dispatch(deleteDepartment({ departmentId, safeAddress: ownerSafeAddress }));
  };

  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Delete Team</Title>
        <Heading>
          Are you sure you want to delete this team and all of its teammates?
        </Heading>
      </ModalHeader>
      <Summary className="mb-3 mx-auto" style={{ maxWidth: "420px" }}>
        <div className="left">
          <img src={TeamPng} alt="teammate" width="80" />
        </div>
        <div className="right">
          <div className="mb-3">
            <div className="section-title mb-1">Team</div>
            <div className="section-desc">{departmentName}</div>
          </div>
        </div>
      </Summary>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div className="col-6">
          <Button large onClick={handleHide} className="secondary">
            Close
          </Button>
        </div>
        <div className="col-6">
          <Button
            large
            onClick={confirmDelete}
            loading={updating}
            disabled={updating}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(DeleteTeamModal);
