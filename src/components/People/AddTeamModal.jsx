import React from "react";
import { connectModal as reduxModal } from "redux-modal";
// import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { AddTeam } from "./styles";
import { Input, Select, ErrorMessage } from "components/common/Form";
import Button from "components/common/Button";
import { Information } from "components/Register/styles";

export const MODAL_NAME = "add-team-modal";

function AddTeamModal(props) {
  const { show, handleHide } = props;
  const { register, handleSubmit, errors, formState, control } = useForm({
    mode: "onChange",
  });

  // const loading = useSelector(makeSelectLoading());

  const onSubmit = (values) => {
    console.log({ values });
  };

  const renderAddTeam = () => {
    return (
      <AddTeam>
        <div>
          <div className="title">Team Name</div>
          <div className="subtitle">What should it be called?</div>
          <div>
            <Input
              name="name"
              register={register}
              required={"Team name is required"}
              placeholder={"Enter Team Name"}
              style={{ width: "20rem" }}
            />
            <ErrorMessage name="name" errors={errors} />
          </div>
        </div>
        <div>
          <div className="title" style={{ marginTop: "2rem" }}>
            Currency to be used
          </div>
          <div className="subtitle">
            Every person in the team will be paid using this currency
          </div>
          <div style={{ marginBottom: "4rem" }}>
            <Select name="token" isSearchable width="14rem" control={control} />
          </div>

          <Information className="mt-1">
            <div>If you want to specify the pay amount in USD, select USD</div>
          </Information>
        </div>
        <div className="add-team-btn">
          <Button
            type="submit"
            width="16rem"
            // loading={updating}
            disabled={!formState.isValid}
          >
            Add Team
          </Button>
        </div>
      </AddTeam>
    );
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Add Team"} toggle={handleHide} />
      <ModalBody width="59rem">
        <form onSubmit={handleSubmit(onSubmit)}>{renderAddTeam()}</form>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddTeamModal);
