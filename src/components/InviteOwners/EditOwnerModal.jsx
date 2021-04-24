import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { cryptoUtils } from "parcel-sdk";

import Button from "components/common/Button";
import { Title } from "components/People/styles";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
} from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import safeSaga from "store/safe/saga";
import safeReducer from "store/safe/reducer";
import { updateOwnerName } from "store/safe/actions";
import { makeSelectUpdating } from "store/safe/selectors";
import { Input, ErrorMessage } from "components/common/Form";
import { useLocalStorage } from "hooks";

export const MODAL_NAME = "edit-owner-modal";
const safeKey = "safe";

const modalStyles = `
  .modal-content {
    border-radius: 20px;
    border: none;
    padding: 20px;
  }
`;

function EditOwnerModal(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const { show, handleHide, name, ownerAddress } = props;

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "all",
  });

  useInjectSaga({ key: safeKey, saga: safeSaga });

  useInjectReducer({ key: safeKey, reducer: safeReducer });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());
  const organisationType = useSelector(makeSelectOrganisationType());

  const onSubmit = async (values) => {
    dispatch(
      updateOwnerName({
        name: cryptoUtils.encryptDataUsingEncryptionKey(
          values.name,
          encryptionKey,
          organisationType
        ),
        ownerAddress,
        safeAddress,
      })
    );
  };

  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Edit Owner Name</Title>
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-3">
          <Input
            type="text"
            name="name"
            register={register}
            required={`Name is required`}
            placeholder="Owner name"
            defaultValue={name}
          />
          <ErrorMessage name="name" errors={errors} />
          <div style={{ fontSize: "14px" }} className="mt-3">
            Address: {ownerAddress}
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center mt-3">
          <div className="col-6">
            <Button large onClick={handleHide} className="secondary">
              Close
            </Button>
          </div>
          <div className="col-6">
            <Button
              large
              loading={updating}
              disabled={!formState.isValid || updating}
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(EditOwnerModal);
