import React, { useEffect, useState } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "reactstrap";
import { cryptoUtils } from "parcel-sdk";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { AddPeopleContainer } from "./styles";
import {
  Input,
  Select,
  ErrorMessage,
  SelectToken,
} from "components/common/Form";
import Button from "components/common/Button";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
} from "store/global/selectors";
import {
  makeSelectTokensDropdown,
  makeSelectLoading,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import addPeopleReducer from "store/add-people/reducer";
import addPeopleSaga from "store/add-people/saga";
import { addPeople } from "store/add-people/actions";
import {
  makeSelectLoading as makeSelectAddingPeople,
  makeSelectError as makeSelectErrorInAdd,
} from "store/add-people/selectors";
import modifyPeopleReducer from "store/modify-people/reducer";
import modifyPeopleSaga from "store/modify-people/saga";
import { editPeople } from "store/modify-people/actions";
import {
  makeSelectUpdating,
  makeSelectError as makeSelectErrorInUpdate,
} from "store/modify-people/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import {
  makeSelectTeamIdToDetailsMap,
  makeSelectTeams,
} from "store/view-teams/selectors";
import { constructLabel } from "utils/tokens";
import ErrorText from "components/common/ErrorText";

export const MODAL_NAME = "add-single-people-modal";
const addPeopleKey = "addPeople";
const modifyPeopleKey = "modifyPeople";

function AddSinglePeopleModal(props) {
  const { show, handleHide, isEditMode, defaultValues, peopleId } = props;
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { account } = useActiveWeb3React();

  const { register, handleSubmit, errors, control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: defaultValues ? defaultValues : {},
  });
  const hasTeamChanged = watch("team");
  const watchedToken = watch("token");

  const [teamsDropdown, setTeamsDropdown] = useState([]);

  // Reducers
  useInjectReducer({ key: addPeopleKey, reducer: addPeopleReducer });
  useInjectReducer({ key: modifyPeopleKey, reducer: modifyPeopleReducer });

  // Sagas
  useInjectSaga({ key: addPeopleKey, saga: addPeopleSaga });
  useInjectSaga({ key: modifyPeopleKey, saga: modifyPeopleSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const tokensDropdown = useSelector(makeSelectTokensDropdown());
  const loadingTokenList = useSelector(makeSelectLoading());
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const adding = useSelector(makeSelectAddingPeople());
  const updating = useSelector(makeSelectUpdating());
  const allTeams = useSelector(makeSelectTeams());
  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());
  const organisationType = useSelector(makeSelectOrganisationType());
  const errorInAdd = useSelector(makeSelectErrorInAdd());
  const errorInUpdate = useSelector(makeSelectErrorInUpdate());

  useEffect(() => {
    let dropdownList = [];
    if (allTeams && allTeams.length > 0) {
      dropdownList = allTeams.map(({ departmentId, name }) => ({
        value: departmentId,
        label: name,
      }));
    }

    if (!isEditMode) {
      dropdownList.unshift({
        value: "",
        label: <div className="text-primary text-bold">Add Team</div>,
      });
    }

    setTeamsDropdown(dropdownList);
  }, [allTeams, isEditMode]);

  const onSubmit = (values) => {
    const { firstName, lastName, address, team, teamName, token, amount } =
      values;
    const tokenInfo = tokenDetails && tokenDetails[values.token.value];
    if (account && safeAddress && tokenInfo) {
      const encryptedEmployeeDetails =
        cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify({
            firstName,
            lastName,
            salaryAmount: amount,
            salaryToken: token.value,
            address,
          }),
          encryptionKey,
          organisationType
        );

      const body = {
        encryptedEmployeeDetails,
        safeAddress,
        createdBy: account,
        departmentId: team.value || undefined,
        departmentName: teamName
          ? teamName
          : teamIdToDetailsMap[team.value].name,
        tokenInfo,
      };

      if (isEditMode) {
        // Update
        dispatch(editPeople({ ...body, peopleId }));
      } else {
        // Add
        dispatch(addPeople(body));
      }
    }
  };

  const renderAddTeam = () => {
    return (
      <AddPeopleContainer>
        <div>
          <div className="title">Personal Details</div>
          <div className="wrapper">
            <div className="w-100">
              <Input
                type="text"
                name="firstName"
                register={register}
                required={`First Name is required`}
                placeholder="First Name"
              />
              <ErrorMessage name="firstName" errors={errors} />
            </div>
            <div className="w-100">
              <Input
                type="text"
                name="lastName"
                register={register}
                placeholder="Last Name"
              />
              <ErrorMessage name="lastName" errors={errors} />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="title">Wallet Address</div>
          <Row>
            <Col lg="12">
              <Input
                type="text"
                name="address"
                register={register}
                required={`Wallet Address is required`}
                pattern={{
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum Address",
                }}
                placeholder="Wallet Address"
              />
              <ErrorMessage name="address" errors={errors} />
            </Col>
          </Row>
        </div>

        <div className="mt-5">
          <div className="title">Choose Team</div>
          <div className="d-flex">
            <div className="mr-3">
              <Controller
                name="team"
                control={control}
                rules={{ required: true }}
                render={({ onChange, value }) => (
                  <Select
                    name="team"
                    required={`Team is required`}
                    width="20rem"
                    control={control}
                    options={teamsDropdown}
                    placeholder={`Select Team...`}
                    defaultValue={null}
                    value={value}
                    onChange={(event) => {
                      const { value } = event;
                      if (value && teamIdToDetailsMap[value]) {
                        const { tokenInfo } = teamIdToDetailsMap[value];
                        console.log({ tokenInfo });
                        const tokenDropdownValue = {
                          value: tokenInfo.symbol,
                          label: constructLabel({
                            token: tokenInfo.symbol,
                            imgUrl: tokenInfo.logoURI,
                          }),
                        };
                        setValue("token", tokenDropdownValue);
                      }
                      onChange(event);
                    }}
                  />
                )}
              />
            </div>
            {hasTeamChanged && !hasTeamChanged.value && (
              <div>
                <Input
                  type="text"
                  name="teamName"
                  register={register}
                  required={`Team Name is required`}
                  placeholder="Enter Team Name"
                  style={{ width: "18rem" }}
                />
                <ErrorMessage name="teamName" errors={errors} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="title">Amount and Currency</div>
          <div className="wrapper">
            <div>
              <Controller
                control={control}
                name="amount"
                rules={{
                  validate: (value) => {
                    if (value < 0) return "Please check your input";
                    return true;
                  },
                }}
                defaultValue=""
                render={({ onChange, value }) => (
                  <Input
                    type="number"
                    name="amount"
                    step="0.001"
                    placeholder={"Enter Amount (Optional)"}
                    style={{ width: "20rem" }}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </div>
            <div>
              <SelectToken
                name="token"
                control={control}
                required={`Token is required`}
                width="18rem"
                options={tokensDropdown}
                isSearchable
                isLoading={loadingTokenList}
                placeholder={`Select Currency...`}
                isDisabled={hasTeamChanged && hasTeamChanged.value}
                defaultValue={null}
              />
            </div>
          </div>
          <ErrorMessage name="amount" errors={errors} />
        </div>

        {errorInAdd && <ErrorText>{errorInAdd}</ErrorText>}
        {errorInUpdate && <ErrorText>{errorInUpdate}</ErrorText>}

        <div className="add-people-btn">
          <Button
            type="submit"
            width="16rem"
            loading={adding || updating}
            disabled={adding || updating || !watchedToken}
          >
            {isEditMode ? `Save` : `Add Person`}
          </Button>
        </div>
      </AddPeopleContainer>
    );
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader
        title={isEditMode ? "Edit Person" : "Add Person"}
        toggle={handleHide}
      />
      <ModalBody width="55rem">
        <form onSubmit={handleSubmit(onSubmit)}>{renderAddTeam()}</form>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddSinglePeopleModal);
