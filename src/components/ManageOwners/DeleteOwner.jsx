import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";

import Button from "components/common/Button";
import { Select } from "components/common/Form";
import { useLocalStorage, useActiveWeb3React, useManageOwners } from "hooks";
import {
  makeSelectError as makeSelectErrorInCreateTx,
  makeSelectLoading as makeSelectSingleOwnerAddTxLoading,
} from "store/transactions/selectors";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import {
  makeSelectOwnerSafeAddress,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
  makeSelectSafeOwners,
  makeSelectThreshold,
} from "store/global/selectors";
import { TRANSACTION_MODES } from "constants/transactions";
import ErrorText from "components/common/ErrorText";
import Avatar from "components/common/Avatar";

import { Information } from "components/Register/styles";
import { DeleteContainer, OwnerDetails } from "./styles";

export default function DeleteOwner(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide, ownerName, ownerAddress } = props;

  const { account } = useActiveWeb3React();
  const [thresholdOptions, setThresholdOptions] = useState();

  const { handleSubmit, formState, control, setValue } = useForm({
    mode: "onChange",
  });

  const { loadingTx, deleteSafeOwner } = useManageOwners();

  const dispatch = useDispatch();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const threshold = useSelector(makeSelectThreshold());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const safeOwners = useSelector(makeSelectSafeOwners());

  useEffect(() => {
    if (safeOwners) {
      const newOptions = [];

      const defaultThreshold =
        threshold > safeOwners.length - 1 ? safeOwners.length - 1 : threshold;

      for (let i = 0; i < safeOwners.length - 1; i++)
        newOptions.push({ value: i + 1, label: i + 1 });

      setThresholdOptions(newOptions);
      setValue("threshold", {
        value: defaultThreshold,
        label: defaultThreshold,
      });
    }
  }, [safeOwners, threshold, dispatch, setValue]);

  const onSubmit = async (values) => {
    const deletedOwnerDetails = [
      {
        deletedOwner: {
          name: cryptoUtils.encryptDataUsingEncryptionKey(
            ownerName,
            encryptionKey,
            organisationType
          ),
          address: ownerAddress,
        },
        newThreshold: values.threshold.value,
        ownersCount: safeOwners.length - 1,
        description: `Removing owner from the Safe`,
      },
    ];

    const to = cryptoUtils.encryptDataUsingEncryptionKey(
      JSON.stringify(deletedOwnerDetails),
      encryptionKey,
      organisationType
    );
    const baseRequestBody = {
      to,
      safeAddress: ownerSafeAddress,
      createdBy: account,
      transactionMode: TRANSACTION_MODES.DELETE_SAFE_OWNER,
      metaData: deletedOwnerDetails[0],
    };

    await deleteSafeOwner({
      owner: ownerAddress,
      safeOwners: safeOwners.map(({ owner }) => owner),
      newThreshold: values.threshold.value,
      baseRequestBody,
    });
  };

  const renderReview = () => {
    const firstName = ownerName && ownerName.split(" ")[0];
    const lastName = ownerName && ownerName.split(" ")[1];
    return (
      <DeleteContainer>
        <div className="title">Review the Owner</div>

        <OwnerDetails backgroundColor="rgba(255, 70, 96, 0.1)">
          <div className="left">
            <Avatar
              firstName={firstName}
              lastName={lastName}
              style={{
                fontSize: "1.2rem",
                width: "3rem",
                height: "3rem",
              }}
            />
            <div className="details">
              <div className="name">{ownerName}</div>
              <div className="address">Address: {ownerAddress}</div>
            </div>
          </div>
        </OwnerDetails>

        <div className="title mt-5">New Threshold</div>
        <div className="subtitle">
          Any transaction requires the confirmation of:
        </div>

        <div className="threshold-select">
          <Select
            name="threshold"
            control={control}
            required={`Threshold is required`}
            width="6rem"
            options={thresholdOptions}
            placeholder={`Select Threshold...`}
            defaultValue={{ value: 0, label: 0 }}
          />
          <div className="subtitle mb-0">
            out of {safeOwners.length - 1} owners.
          </div>
        </div>

        <Information className="mt-5">
          You are about to create an on-chain transaction.
        </Information>

        <div className="buttons">
          <Button
            type="button"
            className="secondary-2"
            onClick={handleHide}
            style={{ minWidth: "16rem" }}
          >
            Close
          </Button>
          <Button
            type="submit"
            style={{ minWidth: "16rem" }}
            className="danger"
            disabled={
              !formState.isValid ||
              loadingTx ||
              addingMultisigTx ||
              addingSingleOwnerTx ||
              loadingSafeDetails ||
              isReadOnly
            }
            loading={loadingTx || addingMultisigTx || addingSingleOwnerTx}
          >
            Delete
          </Button>
        </div>

        {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
      </DeleteContainer>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>{renderReview()}</form>
    </div>
  );
}
