import React, { useEffect } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { AddTeam } from "./styles";
import { Input, Select, ErrorMessage } from "components/common/Form";
import Button from "components/common/Button";
import { Information } from "components/Register/styles";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getTokenList } from "store/tokens/actions";
import {
  makeSelectTokensDropdown,
  makeSelectLoading,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import addTeamReducer from "store/add-team/reducer";
import addTeamSaga from "store/add-team/saga";
import { addTeam } from "store/add-team/actions";
import { makeSelectLoading as makeSelectAddingTeam } from "store/add-team/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useActiveWeb3React } from "hooks";

export const MODAL_NAME = "add-team-modal";
const tokensKey = "tokens";
const addTeamKey = "addTeam";

function AddTeamModal(props) {
  const { show, handleHide } = props;
  const { register, handleSubmit, errors, formState, control } = useForm({
    mode: "onChange",
  });
  const { account } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });
  useInjectReducer({ key: addTeamKey, reducer: addTeamReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });
  useInjectSaga({ key: addTeamKey, saga: addTeamSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const tokensDropdown = useSelector(makeSelectTokensDropdown());
  const loadingTokenList = useSelector(makeSelectLoading());
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const adding = useSelector(makeSelectAddingTeam());

  useEffect(() => {
    if (safeAddress) dispatch(getTokenList(safeAddress));
  }, [dispatch, safeAddress]);

  const onSubmit = (values) => {
    const tokenInfo = tokenDetails && tokenDetails[values.token.value];

    if (account && safeAddress && tokenInfo) {
      dispatch(
        addTeam({
          name: values.name,
          safeAddress,
          createdBy: account,
          tokenInfo,
        })
      );
    }
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
        <div className="mt-5 mb-3">
          <div className="title">Currency to be used</div>
          <div className="subtitle">
            Every person in the team will be paid using this currency
          </div>
          <div>
            <Select
              name="token"
              control={control}
              required={`Token is required`}
              width="13rem"
              options={tokensDropdown}
              isSearchable
              isLoading={loadingTokenList}
            />
          </div>
        </div>
        <Information>
          <div>If you want to specify the pay amount in USD, select USD</div>
        </Information>
        <div className="add-team-btn">
          <Button
            type="submit"
            width="16rem"
            loading={adding}
            disabled={!formState.isValid || adding}
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
