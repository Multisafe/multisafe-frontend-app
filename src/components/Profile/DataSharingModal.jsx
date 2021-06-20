import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useSelector, useDispatch } from "react-redux";

import {
  Modal,
  ModalHeader,
  ModalBody,
} from "components/common/Modal/SimpleModal";
import Button from "components/common/Button";
import {
  makeSelectIsDataSharingAllowed,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { toggleDataSharing } from "store/organisation/actions";
import { makeSelectUpdating } from "store/organisation/selectors";

export const MODAL_NAME = "data-sharing-modal";

function DataSharingModal(props) {
  const { show, handleHide } = props;
  const dispatch = useDispatch();

  const isDataSharingAllowed = useSelector(makeSelectIsDataSharingAllowed());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());

  const handleToggleDataSharing = (isDataSharingAllowed) => {
    dispatch(toggleDataSharing(Number(!isDataSharingAllowed), safeAddress));
  };

  return (
    <Modal toggle={handleHide} isOpen={show}>
      <ModalHeader toggle={handleHide} />
      <ModalBody>
        <div className="title">Data Sharing</div>
        <div className="subtitle mb-5">
          If data sharing is enabled, all your data (such as people, transaction
          history etc.) will be{" "}
          <span className="text-bold">publicly visible</span> even outside
          MultiSafe.
        </div>
        <div className="subtitle">
          This feature is recommended for DAOs. The community can view how the
          DAO manages its treasury with complete transparency.
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <div>
            <Button
              width="16rem"
              onClick={handleHide}
              className="secondary mr-4"
            >
              Close
            </Button>
          </div>
          <div>
            <Button
              width="16rem"
              onClick={() => handleToggleDataSharing(isDataSharingAllowed)}
              loading={updating}
              disabled={updating}
            >
              {!isDataSharingAllowed ? `Enable` : `Disable`}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(DataSharingModal);
