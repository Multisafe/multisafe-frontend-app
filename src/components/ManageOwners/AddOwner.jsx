import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import { Input, ErrorMessage, Select } from "components/common/Form";
import { useMassPayout, useLocalStorage, useActiveWeb3React } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import {
  addTransaction,
  clearTransactionHash,
} from "store/transactions/actions";
import {
  makeSelectMetaTransactionHash,
  makeSelectError as makeSelectErrorInCreateTx,
  makeSelectTransactionId as makeSelectSingleOwnerTransactionId,
  makeSelectLoading as makeSelectSingleOwnerAddTxLoading,
} from "store/transactions/selectors";
import metaTxReducer from "store/metatx/reducer";
import metaTxSaga from "store/metatx/saga";
import { getMetaTxEnabled } from "store/metatx/actions";
import { makeSelectIsMetaTxEnabled } from "store/metatx/selectors";
import safeReducer from "store/safe/reducer";
import safeSaga from "store/safe/saga";
import { getNonce } from "store/safe/actions";
import {
  makeSelectNonce,
  makeSelectLoading as makeSelectLoadingSafeDetails,
} from "store/safe/selectors";
import { createMultisigTransaction } from "store/multisig/actions";
import { makeSelectUpdating as makeSelectAddTxLoading } from "store/multisig/selectors";
import multisigSaga from "store/multisig/saga";
import multisigReducer from "store/multisig/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOwnerSafeAddress,
  makeSelectIsMultiOwner,
  makeSelectOrganisationType,
  makeSelectIsReadOnly,
  makeSelectSafeOwners,
  makeSelectThreshold,
} from "store/global/selectors";
import { TRANSACTION_MODES } from "constants/transactions";
import { MODAL_NAME as TX_SUBMITTED_MODAL } from "components/Payments/TransactionSubmittedModal";
import ErrorText from "components/common/ErrorText";
import Avatar from "components/common/Avatar";
import { STEPS } from "store/login/resources";

import { DeleteContainer, ReplaceContainer, OwnerDetails } from "./styles";

const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const metaTxKey = "metatx";

export default function AddOwner(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide } = props;

  const { account } = useActiveWeb3React();
  const [newOwnerDetails, setNewOwnerDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();
  const [thresholdOptions, setThresholdOptions] = useState();
  const [step, setStep] = useState(STEPS.ZERO);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [newThreshold, setNewThreshold] = useState(1);

  const { register, errors, handleSubmit, formState, control, setValue } =
    useForm({
      mode: "onChange",
    });

  const { txHash, loadingTx, addSafeOwner, txData } = useMassPayout();
  // Reducers
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: safeKey, reducer: safeReducer });
  useInjectReducer({ key: multisigKey, reducer: multisigReducer });
  useInjectReducer({ key: metaTxKey, reducer: metaTxReducer });

  // Sagas
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: safeKey, saga: safeSaga });
  useInjectSaga({ key: multisigKey, saga: multisigSaga });
  useInjectSaga({ key: metaTxKey, saga: metaTxSaga });

  const dispatch = useDispatch();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const threshold = useSelector(makeSelectThreshold());
  const txHashFromMetaTx = useSelector(makeSelectMetaTransactionHash());
  const errorFromMetaTx = useSelector(makeSelectErrorInCreateTx());
  const addingMultisigTx = useSelector(makeSelectAddTxLoading());
  const addingSingleOwnerTx = useSelector(makeSelectSingleOwnerAddTxLoading());
  const nonce = useSelector(makeSelectNonce());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const loadingSafeDetails = useSelector(makeSelectLoadingSafeDetails());
  const singleOwnerTransactionId = useSelector(
    makeSelectSingleOwnerTransactionId()
  );
  const organisationType = useSelector(makeSelectOrganisationType());
  const isMetaEnabled = useSelector(makeSelectIsMetaTxEnabled());
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const safeOwners = useSelector(makeSelectSafeOwners());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getNonce(ownerSafeAddress));
      dispatch(getMetaTxEnabled(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

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

  useEffect(() => {
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  useEffect(() => {
    if (txHash) {
      if (encryptionKey && newOwnerDetails && ownerSafeAddress) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(newOwnerDetails),
          encryptionKey,
          organisationType
        );

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: ownerSafeAddress,
            transactionHash: txHash,
            transactionMode: TRANSACTION_MODES.ADD_SAFE_OWNER,
            metaData: newOwnerDetails[0],
          })
        );
      }
    } else if (txData) {
      if (encryptionKey && newOwnerDetails && ownerSafeAddress) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(newOwnerDetails),
          encryptionKey,
          organisationType
        );

        if (!isMultiOwner) {
          // threshold = 1 or single owner
          dispatch(
            addTransaction({
              to,
              safeAddress: ownerSafeAddress,
              createdBy: account,
              txData,
              transactionMode: TRANSACTION_MODES.ADD_SAFE_OWNER,
              metaData: newOwnerDetails[0],
            })
          );
        } else {
          // threshold > 1
          dispatch(
            createMultisigTransaction({
              to,
              safeAddress: ownerSafeAddress,
              createdBy: account,
              txData,
              transactionMode: TRANSACTION_MODES.ADD_SAFE_OWNER,
              nonce: nonce,
              metaData: newOwnerDetails[0],
            })
          );
        }
      }
    }
  }, [
    txHash,
    encryptionKey,
    newOwnerDetails,
    dispatch,
    ownerSafeAddress,
    txData,
    account,
    isMultiOwner,
    nonce,
    organisationType,
  ]);

  useEffect(() => {
    if (metaTxHash && singleOwnerTransactionId) {
      handleHide();
      dispatch(
        show(TX_SUBMITTED_MODAL, {
          txHash: metaTxHash,
          selectedCount: 1,
          transactionId: singleOwnerTransactionId,
        })
      );
    }
  }, [dispatch, metaTxHash, singleOwnerTransactionId, handleHide]);

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
      setNewOwnerDetails(addOwnerDetails);

      await addSafeOwner({
        owner: newOwnerAddress,
        newThreshold: newThreshold,
        isMultiOwner,
        createNonce: nonce,
        isMetaEnabled,
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
              <div className="address mt-2">
                Threshold:
                <span className="text-bold">
                  {" "}
                  {newThreshold} out of {safeOwners.length + 1} owners
                </span>
              </div>
            </div>
          </div>
        </OwnerDetails>

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
