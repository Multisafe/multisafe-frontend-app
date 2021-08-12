import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";

import Button from "components/common/Button";
import { Input, ErrorMessage, Select } from "components/common/Form";
import { useActiveWeb3React, useManageOwners, useEncryptionKey } from "hooks";
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
import { STEPS } from "store/login/resources";

import { Information } from "components/Register/styles";
import { DeleteContainer, ReplaceContainer, OwnerDetails } from "./styles";

export default function AddOwner(props) {
  const [encryptionKey] = useEncryptionKey();

  const { handleHide } = props;

  const { account } = useActiveWeb3React();
  const [thresholdOptions, setThresholdOptions] = useState();
  const [step, setStep] = useState(STEPS.ZERO);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [newThreshold, setNewThreshold] = useState(1);

  const { register, errors, handleSubmit, formState, control, setValue } =
    useForm({
      mode: "onChange",
    });

  const { loadingTx, addSafeOwner } = useManageOwners();

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

      const defaultThreshold = threshold;

      for (let i = 0; i < safeOwners.length + 1; i++)
        newOptions.push({ value: i + 1, label: i + 1 });

      setThresholdOptions(newOptions);
      setValue("threshold", {
        value: defaultThreshold,
        label: defaultThreshold,
      });
    }
  }, [safeOwners, threshold, dispatch, setValue]);

  const onSubmit = async (values) => {
    if (step === STEPS.ZERO) {
      setNewOwnerName(values.name);
      setNewOwnerAddress(values.address);
      setNewThreshold(values.threshold.value);
      setStep((step) => step + 1);
    } else {
      const addOwnerDetails = [
        {
          newOwner: {
            name: cryptoUtils.encryptDataUsingEncryptionKey(
              newOwnerName,
              encryptionKey,
              organisationType
            ),
            address: newOwnerAddress,
          },
          newThreshold,
          ownersCount: safeOwners.length + 1,
          description: `Adding owner to the Safe`,
        },
      ];

      const to = cryptoUtils.encryptDataUsingEncryptionKey(
        JSON.stringify(addOwnerDetails),
        encryptionKey,
        organisationType
      );
      const baseRequestBody = {
        to,
        safeAddress: ownerSafeAddress,
        createdBy: account,
        transactionMode: TRANSACTION_MODES.ADD_SAFE_OWNER,
        metaData: addOwnerDetails[0],
      };

      await addSafeOwner({
        owner: newOwnerAddress,
        newThreshold: newThreshold,
        baseRequestBody,
      });
    }
  };

  const renderNewOwnerDetails = () => {
    return (
      <DeleteContainer>
        <div className="title">New Owner</div>
        <div className="mb-3">
          <Input
            type="text"
            name="name"
            register={register}
            required={`Name is required`}
            placeholder="Owner Name"
            defaultValue={newOwnerName}
          />
          <ErrorMessage name="name" errors={errors} />
        </div>

        <div className="title mb-2 mt-5">Address</div>
        <div className="mb-3">
          <Input
            type="text"
            name="address"
            register={register}
            required={`Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Owner Address"
            defaultValue={newOwnerAddress}
          />
          <ErrorMessage name="address" errors={errors} />
        </div>

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
            defaultValue={{ value: newThreshold, label: newThreshold }}
          />
          <div className="subtitle mb-0">
            out of {safeOwners.length + 1} owners.
          </div>
        </div>

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
            disabled={!formState.isValid}
          >
            Next
          </Button>
        </div>

        {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
      </DeleteContainer>
    );
  };

  const renderReview = () => {
    const newFirstName = newOwnerName && newOwnerName.split(" ")[0];
    const newLastName = newOwnerName && newOwnerName.split(" ")[1];
    return (
      <ReplaceContainer>
        <div className="title">Review the Owner</div>

        <OwnerDetails>
          <div className="left">
            <Avatar
              firstName={newFirstName}
              lastName={newLastName}
              style={{
                fontSize: "1.2rem",
                width: "3rem",
                height: "3rem",
              }}
            />
            <div className="details">
              <div className="name">{newOwnerName}</div>
              <div className="address">Address: {newOwnerAddress}</div>
              <div className="address">
                Threshold:
                <span className="text-bold">
                  {" "}
                  {newThreshold} out of {safeOwners.length + 1} owners
                </span>
              </div>
            </div>
          </div>
        </OwnerDetails>

        <Information className="mt-5">
          You are about to create an on-chain transaction.
        </Information>

        <div className="buttons">
          <Button
            type="button"
            className="secondary-2"
            onClick={() => setStep((step) => step - 1)}
            style={{ minWidth: "16rem" }}
          >
            Back
          </Button>
          <Button
            type="submit"
            style={{ minWidth: "16rem" }}
            disabled={
              loadingTx ||
              addingMultisigTx ||
              addingSingleOwnerTx ||
              loadingSafeDetails ||
              isReadOnly
            }
            loading={loadingTx || addingMultisigTx || addingSingleOwnerTx}
          >
            Confirm
          </Button>
        </div>

        {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
      </ReplaceContainer>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === STEPS.ZERO && renderNewOwnerDetails()}
        {step === STEPS.ONE && renderReview()}
      </form>
    </div>
  );
}
