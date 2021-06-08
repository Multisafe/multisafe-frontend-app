import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import Button from "components/common/Button";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOwnerName,
  makeSelectIsReadOnly,
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
import EtherscanLink from "components/common/EtherscanLink";
import { ETHERSCAN_LINK_TYPES } from "components/common/Web3Utils";
import ErrorText from "components/common/ErrorText";

const organisationKey = "organisation";

export default function Profile() {
  const [disabled, setDisabled] = useState();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationName = useSelector(makeSelectOwnerName());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const loading = useSelector(makeSelectLoading());
  const error = useSelector(makeSelectError());

  const { register, handleSubmit, watch, formState, errors } = useForm({
    defaultValues: { name: organisationName || "" },
    mode: "onChange",
  });

  const inputName = watch("name");

  useEffect(() => {
    if (inputName === organisationName) setDisabled(true);
    else setDisabled(false);
  }, [organisationName, inputName]);

  // Reducers
  useInjectReducer({ key: organisationKey, reducer: organisationReducer });

  // Sagas
  useInjectSaga({ key: organisationKey, saga: organisationSaga });

  const dispatch = useDispatch();

  const onSubmit = (values) => {
    dispatch(modifyOrganisationName(values.name, safeAddress));
  };

  const renderOrganisationDetails = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="title">Organisation Name</div>
      <div style={{ marginBottom: "2rem" }}>
        <Input
          name="name"
          id="name"
          register={register}
          required
          type="text"
          style={{ maxWidth: "32rem" }}
        />
        <ErrorMessage name="name" errors={errors} />
      </div>
      <div className="title">Organisation Address</div>
      <div className="address">
        <div>{safeAddress}</div>
        <CopyButton
          id="address"
          tooltip="address"
          value={safeAddress}
          className="mx-3"
        />
        <EtherscanLink
          id="etherscan-link"
          type={ETHERSCAN_LINK_TYPES.ADDRESS}
          address={safeAddress}
        />
      </div>

      <div className="mt-5">
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
      {error && <ErrorText>{error}</ErrorText>}
    </form>
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
    </div>
  );
}
