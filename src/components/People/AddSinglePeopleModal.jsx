import React, { useEffect, useState } from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Row, Col } from "reactstrap";
import { cryptoUtils } from "parcel-sdk";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { AddPeopleContainer } from "./styles";
import { Input, Select, ErrorMessage } from "components/common/Form";
import Button from "components/common/Button";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
} from "store/global/selectors";
import { getTokenList } from "store/tokens/actions";
import {
  makeSelectTokensDropdown,
  makeSelectLoading,
  makeSelectTokensDetails,
} from "store/tokens/selectors";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import addPeopleReducer from "store/add-people/reducer";
import addPeopleSaga from "store/add-people/saga";
import { addPeople } from "store/add-people/actions";
import {
  makeSelectLoading as makeSelectAddingPeople,
  makeSelectError,
} from "store/add-people/selectors";
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
const tokensKey = "tokens";
const addPeopleKey = "addPeople";

function AddSinglePeopleModal(props) {
  const { show, handleHide } = props;
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { account } = useActiveWeb3React();

  const { register, handleSubmit, errors, control, watch, setValue } = useForm({
    mode: "onChange",
  });
  const teamChanged = watch("team");

  const [teamsDropdown, setTeamsDropdown] = useState([]);

  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });
  useInjectReducer({ key: addPeopleKey, reducer: addPeopleReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });
  useInjectSaga({ key: addPeopleKey, saga: addPeopleSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const tokensDropdown = useSelector(makeSelectTokensDropdown());
  const loadingTokenList = useSelector(makeSelectLoading());
  const tokenDetails = useSelector(makeSelectTokensDetails());
  const adding = useSelector(makeSelectAddingPeople());
  const allTeams = useSelector(makeSelectTeams());
  const teamIdToDetailsMap = useSelector(makeSelectTeamIdToDetailsMap());
  const organisationType = useSelector(makeSelectOrganisationType());
  const error = useSelector(makeSelectError());

  useEffect(() => {
    if (
      teamChanged &&
      teamChanged.value &&
      teamIdToDetailsMap[teamChanged.value]
    ) {
      const { tokenInfo } = teamIdToDetailsMap[teamChanged.value];
      setValue("token", {
        value: tokenInfo.symbol,
        label: constructLabel(tokenInfo.symbol, tokenInfo.logoURI),
      });
    }
  }, [teamChanged, setValue, teamIdToDetailsMap]);

  useEffect(() => {
    if (safeAddress && !tokenDetails) dispatch(getTokenList(safeAddress));
  }, [dispatch, safeAddress, tokenDetails]);

  useEffect(() => {
    if (allTeams && allTeams.length > 0) {
      const dropdownList = allTeams.map(({ departmentId, name }) => ({
        value: departmentId,
        label: name,
      }));
      dropdownList.unshift({
        value: "",
        label: <div className="text-primary text-bold">Add Team</div>,
      });

      setTeamsDropdown(dropdownList);
    }
  }, [allTeams]);

  const onSubmit = (values) => {
    const {
      firstName,
      lastName,
      address,
      team,
      teamName,
      token,
      amount,
    } = values;
    const tokenInfo = tokenDetails && tokenDetails[values.token.value];
    if (account && safeAddress && tokenInfo) {
      const encryptedEmployeeDetails = cryptoUtils.encryptDataUsingEncryptionKey(
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
      };

      dispatch(addPeople(body));
    }
  };

  const renderAddTeam = () => {
    return (
      <AddPeopleContainer>
        <div>
          <div className="title">Personal Details</div>
          <Row>
            <Col lg="6" sm="12">
              <Input
                type="text"
                name="firstName"
                register={register}
                required={`First Name is required`}
                placeholder="First Name"
              />
              <ErrorMessage name="firstName" errors={errors} />
            </Col>
            <Col lg="6" sm="12">
              <Input
                type="text"
                name="lastName"
                register={register}
                placeholder="Last Name"
              />
              <ErrorMessage name="lastName" errors={errors} />
            </Col>
          </Row>
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
          <Row>
            <Col lg="6" sm="12">
              <Select
                name="team"
                control={control}
                required={`Team is required`}
                width="100%"
                options={teamsDropdown}
                placeholder={`Select Team...`}
              />
            </Col>
            {teamChanged && !teamChanged.value && (
              <Col lg="6" sm="12">
                <Input
                  type="text"
                  name="teamName"
                  register={register}
                  required={`Team Name is required`}
                  placeholder="Enter Team Name"
                />
                <ErrorMessage name="teamName" errors={errors} />
              </Col>
            )}
          </Row>
        </div>

        <div className="mt-5">
          <div className="title">Currency and Amount</div>
          <div className="d-flex">
            <div className="mr-3">
              <Input
                type="number"
                name="amount"
                step="0.001"
                register={register}
                required={"Amount is required"}
                placeholder={"Enter Amount"}
                style={{ width: "20rem" }}
              />
              <ErrorMessage name="amount" errors={errors} />
            </div>
            <div>
              <Select
                name="token"
                control={control}
                required={`Token is required`}
                width="18rem"
                options={tokensDropdown}
                isSearchable
                isLoading={loadingTokenList}
                placeholder={`Select Currency...`}
                isDisabled={teamChanged && teamChanged.value}
              />
            </div>
          </div>
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <div className="add-people-btn">
          <Button
            type="submit"
            width="16rem"
            loading={adding}
            disabled={adding}
          >
            Add Person
          </Button>
        </div>
      </AddPeopleContainer>
    );
  };

  return (
    <Modal isOpen={show} toggle={handleHide}>
      <ModalHeader title={"Add Person"} toggle={handleHide} />
      <ModalBody width="55rem">
        <form onSubmit={handleSubmit(onSubmit)}>{renderAddTeam()}</form>
      </ModalBody>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(AddSinglePeopleModal);
