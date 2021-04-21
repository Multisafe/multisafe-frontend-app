import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/SimpleModal";
import Button from "components/common/Button";
import { deleteTeam } from "store/modify-team/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectUpdating } from "store/modify-team/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import modifyTeamReducer from "store/modify-team/reducer";
import modifyTeamSaga from "store/modify-team/saga";

export const MODAL_NAME = "delete-team-modal";
const modifyTeamKey = "modifyTeam";

function DeleteTeamModal(props) {
  const { show, handleHide, departmentId } = props;

  useInjectReducer({ key: modifyTeamKey, reducer: modifyTeamReducer });

  useInjectSaga({ key: modifyTeamKey, saga: modifyTeamSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());

  const confirmDelete = () => {
    dispatch(deleteTeam({ departmentId, safeAddress: ownerSafeAddress }));
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Delete Team</div>
        <div className="subtitle">
          Are you sure you want to delete this team?
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <div>
            <Button
              width="16rem"
              onClick={handleHide}
              className="secondary mr-4"
            >
              No
            </Button>
          </div>
          <div>
            <Button
              width="16rem"
              onClick={confirmDelete}
              loading={updating}
              disabled={updating}
            >
              Yes
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(DeleteTeamModal);
