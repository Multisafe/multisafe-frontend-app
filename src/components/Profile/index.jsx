import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import ReactTooltip from "react-tooltip";
import { show } from "redux-modal";

import Button from "components/common/Button";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOwnerName,
  makeSelectIsReadOnly,
  makeSelectIsDataSharingAllowed,
  makeSelectIsOrganisationPublic,
} from "store/global/selectors";
import CopyButton from "components/common/Copy";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import organisationReducer from "store/organisation/reducer";
import organisationSaga from "store/organisation/saga";
import {
  makeSelectLoading,
  makeSelectError,
} from "store/organisation/selectors";
import { modifyOrganisationName } from "store/organisation/actions";
import { InfoCard } from "components/People/styles";
import { ProfileContainer } from "./styles";
import { ErrorMessage, Input } from "components/common/Form";
import BlockExplorerLink from "components/common/BlockExplorerLink";
import { EXPLORER_LINK_TYPES } from "components/common/Web3Utils";
import ErrorText from "components/common/ErrorText";
import Img from "components/common/Img";
import InfoIcon from "assets/icons/dashboard/info-icon.svg";
import DataSharingModal, {
  MODAL_NAME as DATA_SHARING_MODAL,
} from "./DataSharingModal";

const organisationKey = "organisation";

export default function Profile() {
  const [disabled, setDisabled] = useState();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationName = useSelector(makeSelectOwnerName());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const loading = useSelector(makeSelectLoading());
  const error = useSelector(makeSelectError());
  const isDataSharingAllowed = useSelector(makeSelectIsDataSharingAllowed());
  const isOrganisationPublic = useSelector(makeSelectIsOrganisationPublic());

  const { register, handleSubmit, watch, formState, errors, setValue } =
    useForm({ mode: "onChange" });

  const inputName = watch("name");

  useEffect(() => {
    if (inputName === organisationName) setDisabled(true);
    else setDisabled(false);
  }, [organisationName, inputName]);

  useEffect(() => {
    if (organisationName) {
      setValue("name", organisationName);
    }
  }, [organisationName, setValue]);

  // Reducers
  useInjectReducer({ key: organisationKey, reducer: organisationReducer });

  // Sagas
  useInjectSaga({ key: organisationKey, saga: organisationSaga });

  const dispatch = useDispatch();

  const showDataSharingModal = () => {
    dispatch(show(DATA_SHARING_MODAL));
  };

  const onSubmit = (values) => {
    dispatch(modifyOrganisationName(values.name, safeAddress));
  };

  const renderOrganisationDetails = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="title">Organisation Name</div>
      <div className="name-container">
        <Input
          name="name"
          id="name"
          register={register}
          required
          type="text"
          style={{ maxWidth: "32rem" }}
        />
        <Button
          className="primary"
          width="16rem"
          type="submit"
          disabled={!formState.isValid || disabled || loading || isReadOnly}
          loading={loading}
        >
          Update
        </Button>
      </div>
      <div>
        <ErrorMessage name="name" errors={errors} />
      </div>
      <div className="title" style={{ marginTop: "2rem" }}>
        Organisation Address
      </div>
      <div className="address">
        <div>{safeAddress}</div>
        <CopyButton
          id="address"
          tooltip="address"
          value={safeAddress}
          className="mx-3"
        />
        <BlockExplorerLink
          id="block-explorer-link"
          type={EXPLORER_LINK_TYPES.ADDRESS}
          address={safeAddress}
        />
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </form>
  );

  const renderShareData = () => (
    <div>
      <div className="title">
        <span className="mr-2">Data Sharing</span>
        <Img
          id={`data-sharing`}
          src={InfoIcon}
          alt="info"
          data-for={`data-sharing`}
          data-tip={`
          If data sharing is enabled, all your data (such as people, transaction history etc.)
          <br /> 
          will be publicly visible even outside Coinshift`}
        />
        <ReactTooltip
          id={`data-sharing`}
          place={"right"}
          type={"dark"}
          effect={"solid"}
          multiline={true}
        />
      </div>
      <div className="subtitle">
        Data sharing for your organisation is currently{" "}
        <span className="text-bold">
          {isDataSharingAllowed ? "enabled" : "disabled"}
        </span>
      </div>

      <div className="mt-4">
        <Button
          type="button"
          className={!isDataSharingAllowed ? "primary" : "secondary-2"}
          onClick={showDataSharingModal}
          disabled={isReadOnly}
        >
          {!isDataSharingAllowed
            ? `Enable Data Sharing`
            : `Disable Data Sharing`}
        </Button>
      </div>
      <DataSharingModal />
    </div>
  );

  return (
    <div>
      <InfoCard className="mt-5">
        <div>
          <div className="title">Profile</div>
          <div className="subtitle">View and edit your account</div>
        </div>
      </InfoCard>
      <ProfileContainer>{renderOrganisationDetails()}</ProfileContainer>
      {isOrganisationPublic && (
        <ProfileContainer>{renderShareData()}</ProfileContainer>
      )}
    </div>
  );
}
