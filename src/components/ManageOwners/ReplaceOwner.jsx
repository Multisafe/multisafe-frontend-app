import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";

import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
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
} from "store/global/selectors";
import { TRANSACTION_MODES } from "constants/transactions";
import ErrorText from "components/common/ErrorText";
import Avatar from "components/common/Avatar";
import { STEPS } from "store/login/resources";

import { Information } from "components/Register/styles";
import { ReplaceContainer, OwnerDetails } from "./styles";

export default function ReplaceOwner(props) {
  const [encryptionKey] = useEncryptionKey();

  const { handleHide, ownerName, ownerAddress } = props;

  const { account } = useActiveWeb3React();
  const [step, setStep] = useState(STEPS.ZERO);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const { loadingTx, replaceSafeOwner } = useManageOwners();

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const safeOwners = useSelector(makeSelectSafeOwners());

  const onSubmit = async (values) => {
    if (step === STEPS.ZERO) {
      setNewOwnerName(values.name);
      setNewOwnerAddress(values.address);
      setStep((step) => step + 1);
    } else {
      const replaceOwnerDetails = [
        {
          oldOwner: {
            name: cryptoUtils.encryptDataUsingEncryptionKey(
              ownerName,
              encryptionKey,
              organisationType
            ),
            address: ownerAddress,
          },
          newOwner: {
            name: cryptoUtils.encryptDataUsingEncryptionKey(
              newOwnerName,
              encryptionKey,
              organisationType
            ),
            address: newOwnerAddress,
          },
          description: `Replacing owner of the Safe`,
        },
      ];

      const to = cryptoUtils.encryptDataUsingEncryptionKey(
        JSON.stringify(replaceOwnerDetails),
        encryptionKey,
        organisationType
      );
      const baseRequestBody = {
        to,
        safeAddress: ownerSafeAddress,
        createdBy: account,
        transactionMode: TRANSACTION_MODES.REPLACE_SAFE_OWNER,
        metaData: replaceOwnerDetails[0],
      };

      await replaceSafeOwner({
        oldOwner: ownerAddress,
        newOwner: newOwnerAddress,
        safeOwners: safeOwners.map(({ owner }) => owner),
        baseRequestBody,
      });
    }
  };

  const renderReplaceOwnerDetails = () => {
    const firstName = ownerName && ownerName.split(" ")[0];
    const lastName = ownerName && ownerName.split(" ")[1];
    return (
      <ReplaceContainer>
        <div className="title">Current Owner</div>

        <OwnerDetails>
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

        <div className="title mt-5">New Owner</div>
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
      </ReplaceContainer>
    );
  };

  const renderReview = () => {
    const firstName = ownerName && ownerName.split(" ")[0];
    const lastName = ownerName && ownerName.split(" ")[1];
    const newFirstName = newOwnerName && newOwnerName.split(" ")[0];
    const newLastName = newOwnerName && newOwnerName.split(" ")[1];
    return (
      <ReplaceContainer>
        <div className="title">Removing Owner</div>

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

        <div className="title mt-5">New Owner</div>

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
        {step === STEPS.ZERO && renderReplaceOwnerDetails()}
        {step === STEPS.ONE && renderReview()}
      </form>
    </div>
  );
}
