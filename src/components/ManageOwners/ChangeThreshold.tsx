import React, { useEffect, useState } from "react";
//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { useActiveWeb3React, useLocalStorage, useManageOwners } from "hooks";
import { STEPS } from "store/login/resources";
import {
  makeSelectIsReadOnly,
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
  makeSelectSafeOwners,
  makeSelectThreshold,
} from "store/global/selectors";
import { makeSelectLoading as makeSelectLoadingSafeDetails } from "store/safe/selectors";
import { TRANSACTION_MODES } from "constants/transactions";
import { DeleteContainer, OwnerDetails, ReplaceContainer } from "./styles";
import { Select } from "components/common/Form";
import Button from "components/common/Button";
import ErrorText from "components/common/ErrorText";
import { Information } from "components/Register/styles";
import { makeSelectError as makeSelectErrorInCreateTx } from "store/transactions/selectors";

const THRESHOLD_CONTROL = "threshold";

export const ChangeThreshold = () => {
  const dispatch = useDispatch();

  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { account } = useActiveWeb3React();
  const [thresholdOptions, setThresholdOptions] = useState<FixMe[]>();
  const [step, setStep] = useState(STEPS.ZERO);
  const [newThreshold, setNewThreshold] = useState(1);

  const { loadingTx, changeThreshold } = useManageOwners();

  const { handleSubmit, formState, control, setValue } = useForm({
    mode: "onChange",
  });

  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const threshold = useSelector(makeSelectThreshold());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const organisationType = useSelector(makeSelectOrganisationType());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const safeOwners = useSelector(makeSelectSafeOwners());

  const { value: thresholdValue } = useWatch({
    control,
    name: THRESHOLD_CONTROL,
    defaultValue: threshold,
  });

  useEffect(() => {
    if (safeOwners) {
      const newOptions = [];

      const defaultThreshold = threshold;

      for (let i = 0; i < safeOwners.length; i++)
        newOptions.push({ value: i + 1, label: i + 1 });

      setThresholdOptions(newOptions);
      setValue("threshold", {
        value: defaultThreshold,
        label: defaultThreshold,
      });
    }
  }, [safeOwners, threshold, dispatch, setValue]);

  const onSubmit = async (values: FixMe) => {
    if (step === STEPS.ZERO) {
      setNewThreshold(values.threshold.value);
      setStep((step) => step + 1);
    } else {
      const changeThresholdDetails = [
        {
          safeOwners: safeOwners.length,
          threshold,
          newThreshold,
          description: `Changing safe signature threshold from ${threshold}/${safeOwners.length} to ${newThreshold}/${safeOwners.length}`,
        },
      ];

      const to = cryptoUtils.encryptDataUsingEncryptionKey(
        JSON.stringify(changeThresholdDetails),
        encryptionKey,
        organisationType
      );
      const baseRequestBody = {
        to,
        safeAddress: ownerSafeAddress,
        createdBy: account,
        transactionMode: TRANSACTION_MODES.CHANGE_THRESHOLD,
        metaData: changeThresholdDetails[0],
      };

      await changeThreshold({
        newThreshold: newThreshold,
        baseRequestBody,
      });
    }
  };

  const renderThresholdDetails = () => {
    return (
      <DeleteContainer>
        <div className="title">Edit Threshold</div>
        <div className="subtitle">
          Any transaction requires the confirmation of:
        </div>

        <div className="threshold-select">
          <Select
            name={THRESHOLD_CONTROL}
            control={control}
            required={`Threshold is required`}
            width="6rem"
            options={thresholdOptions}
            placeholder={`Select Threshold...`}
            defaultValue={{ value: newThreshold, label: newThreshold }}
          />
          <div className="subtitle mb-0">
            out of {safeOwners.length} owners.
          </div>
        </div>

        <div className="buttons">
          <Button
            type="submit"
            style={{ minWidth: "16rem" }}
            disabled={!formState.isValid || thresholdValue === threshold}
          >
            Next
          </Button>
        </div>

        {errorFromMetaTx && <ErrorText>{errorFromMetaTx}</ErrorText>}
      </DeleteContainer>
    );
  };

  const renderReview = () => {
    return (
      <ReplaceContainer>
        <div className="title">Review Change</div>

        <OwnerDetails>
          <div className="left">
            <div className="details">
              <div className="address">
                Threshold:
                <span className="text-bold">
                  {" "}
                  {newThreshold} out of {safeOwners.length} owners
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
            disabled={loadingTx || loadingSafeDetails || isReadOnly}
            loading={loadingTx}
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
        {step === STEPS.ZERO && renderThresholdDetails()}
        {step === STEPS.ONE && renderReview()}
      </form>
    </div>
  );
};
