import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/SimpleModal";
import Button from "components/common/Button";
import { deletePeople } from "store/modify-people/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectUpdating } from "store/modify-people/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import modifyPeopleReducer from "store/modify-people/reducer";
import modifyPeopleSaga from "store/modify-people/saga";

export const MODAL_NAME = "delete-teammate-modal";
const modifyPeople = "modifyPeople";

function DeletePeopleModal(props) {
  const { show, handleHide, peopleId } = props;

  useInjectReducer({ key: modifyPeople, reducer: modifyPeopleReducer });

  useInjectSaga({ key: modifyPeople, saga: modifyPeopleSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());

  const confirmDelete = () => {
    dispatch(deletePeople(ownerSafeAddress, peopleId));
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Delete Person</div>
        <div className="subtitle">
          Are you sure you want to delete this person?
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

export default reduxModal({ name: MODAL_NAME })(DeletePeopleModal);
