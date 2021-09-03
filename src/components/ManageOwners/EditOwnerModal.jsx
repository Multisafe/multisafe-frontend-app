import React from "react";
import { Modal, ModalHeader, ModalBody } from "components/common/Modal";

import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { cryptoUtils } from "coinshift-sdk";

import Button from "components/common/Button";
import { EditContainer } from "./styles";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
} from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import safeSaga from "store/safe/saga";
import safeReducer from "store/safe/reducer";
import { updateOwnerName } from "store/safe/actions";
import { makeSelectUpdating } from "store/safe/selectors";
import { Input, ErrorMessage } from "components/common/Form";
import { useEncryptionKey } from "hooks";

export const MODAL_NAME = "edit-owner-modal";
const safeKey = "safe";

function EditOwnerModal(props) {
  const [encryptionKey] = useEncryptionKey();
  const { show, handleHide, ownerName, ownerAddress } = props;

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  useInjectSaga({ key: safeKey, saga: safeSaga });

  useInjectReducer({ key: safeKey, reducer: safeReducer });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

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
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Edit Owner"} toggle={handleHide} />
      <ModalBody width="55rem" minHeight="auto">
        <EditContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="title">Name</div>
            <div>
              <Input
                type="text"
                name="name"
                register={register}
                required={`Name is required`}
                placeholder="Owner name"
                defaultValue={ownerName}
              />
              <ErrorMessage name="name" errors={errors} />
            </div>

            <div className="title mt-5">Address</div>
            <div className="subtitle">{ownerAddress}</div>

            <div className="edit-name-btn">
              <Button
                width="16rem"
                loading={updating}
                disabled={!formState.isValid || updating || isReadOnly}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </EditContainer>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(EditOwnerModal);
