import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { cryptoUtils } from "parcel-sdk";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { AddTeamContainer } from "./styles";
import { Input, SelectToken, ErrorMessage } from "components/common/Form";
import Button from "components/common/Button";
import { Information } from "components/Register/styles";
import {
  makeSelectIsReadOnly,
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import {
  makeSelectTokensDropdown,
  makeSelectLoading,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import addTeamReducer from "store/add-team/reducer";
import addTeamSaga from "store/add-team/saga";
import { addTeam } from "store/add-team/actions";
import {
  makeSelectLoading as makeSelectAddingTeam,
  makeSelectError as makeSelectErrorInAdd,
} from "store/add-team/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import {
  makeSelectUpdating,
  makeSelectError as makeSelectErrorInUpdate,
} from "store/modify-team/selectors";
import modifyTeamReducer from "store/modify-team/reducer";
import modifyTeamSaga from "store/modify-team/saga";
import { editTeam } from "store/modify-team/actions";
import ErrorText from "components/common/ErrorText";
import { useEffect } from "react";
import { getPeopleByTeam } from "store/view-people/actions";
import { makeSelectPeopleByTeam } from "store/view-people/selectors";
import { getDecryptedDetails } from "utils/encryption";

export const MODAL_NAME = "add-team-modal";
const addTeamKey = "addTeam";
const modifyTeamKey = "modifyTeam";

function AddTeamModal(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const { show, handleHide, isEditMode, defaultValues, departmentId } = props;
  const { register, handleSubmit, errors, formState, control } = useForm({
    mode: "onChange",
    defaultValues: isEditMode ? defaultValues : {},
  });
  const { account } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: addTeamKey, reducer: addTeamReducer });
  useInjectReducer({ key: modifyTeamKey, reducer: modifyTeamReducer });

  // Sagas
  useInjectSaga({ key: addTeamKey, saga: addTeamSaga });
  useInjectSaga({ key: modifyTeamKey, saga: modifyTeamSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const tokensDropdown = useSelector(makeSelectTokensDropdown());
  const loadingTokenList = useSelector(makeSelectLoading());
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const peopleByTeam = useSelector(makeSelectPeopleByTeam());
  const adding = useSelector(makeSelectAddingTeam());
  const updating = useSelector(makeSelectUpdating());
  const errorInAdd = useSelector(makeSelectErrorInAdd());
  const errorInUpdate = useSelector(makeSelectErrorInUpdate());
  const isReadOnly = useSelector(makeSelectIsReadOnly());

  useEffect(() => {
    if (isEditMode && safeAddress && departmentId) {
      dispatch(getPeopleByTeam(safeAddress, departmentId));
    }
  }, [isEditMode, dispatch, safeAddress, departmentId]);

  const onSubmit = (values) => {
    const tokenInfo = tokenDetails && tokenDetails[values.token.value];

    if (account && safeAddress && tokenInfo) {
      const body = {
        name: values.name,
        safeAddress,
        createdBy: account,
        tokenInfo,
      };

      if (isEditMode) {
        const peopleDetails = peopleByTeam.map(
          ({ data, departmentName, ...rest }) => {
            const { firstName, lastName, salaryAmount, address } =
              getDecryptedDetails(data, encryptionKey, organisationType);
            const encryptedData = cryptoUtils.encryptDataUsingEncryptionKey(
              JSON.stringify({
                firstName,
                lastName,
                salaryAmount,
                salaryToken: tokenInfo.symbol,
                address,
              }),
              encryptionKey,
              organisationType
            );

            return {
              data: encryptedData,
              departmentName: values.name,
              ...rest,
            };
          }
        );

        dispatch(editTeam({ ...body, departmentId, peopleDetails }));
      } else {
        dispatch(addTeam(body));
      }
    }
  };

  const renderAddTeam = () => {
    return (
      <AddTeamContainer>
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
            <SelectToken
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
        {errorInAdd && <ErrorText>{errorInAdd}</ErrorText>}
        {errorInUpdate && <ErrorText>{errorInUpdate}</ErrorText>}
        <div className="add-team-btn">
          <Button
            type="submit"
            width="16rem"
            loading={adding || updating}
            disabled={!formState.isValid || adding || updating || isReadOnly}
          >
            {isEditMode ? `Save` : `Add Team`}
          </Button>
        </div>
      </AddTeamContainer>
    );
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader
        title={isEditMode ? `Edit Team` : `Add Team`}
        toggle={handleHide}
      />
      <ModalBody width="59rem">
        <form onSubmit={handleSubmit(onSubmit)}>{renderAddTeam()}</form>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddTeamModal);
