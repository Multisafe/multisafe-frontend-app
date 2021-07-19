import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import { Select } from "components/common/Form";
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

import { DeleteContainer, OwnerDetails } from "./styles";

const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const metaTxKey = "metatx";

export default function ReplaceOwner(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide, ownerName, ownerAddress } = props;

  const { account } = useActiveWeb3React();
  const [deletedOwnerDetails, setDeletedOwnerDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();
  const [thresholdOptions, setThresholdOptions] = useState();

  const { handleSubmit, formState, control, setValue } = useForm({
    mode: "onChange",
  });

  const { txHash, loadingTx, deleteSafeOwner, txData } = useMassPayout();
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

  useEffect(() => {
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  useEffect(() => {
    if (txHash) {
      if (encryptionKey && deletedOwnerDetails && ownerSafeAddress) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(deletedOwnerDetails),
          encryptionKey,
          organisationType
        );

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: ownerSafeAddress,
            transactionHash: txHash,
            // tokenValue: 0,
            // tokenCurrency: "",
            // fiatValue: 0,
            // addresses: [],
            transactionMode: TRANSACTION_MODES.DELETE_SAFE_OWNER,
            metaData: deletedOwnerDetails[0],
          })
        );
      }
    } else if (txData) {
      if (encryptionKey && deletedOwnerDetails && ownerSafeAddress) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(deletedOwnerDetails),
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
              transactionMode: TRANSACTION_MODES.DELETE_SAFE_OWNER,
              metaData: deletedOwnerDetails[0],
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
              transactionMode: TRANSACTION_MODES.DELETE_SAFE_OWNER,
              nonce: nonce,
              metaData: deletedOwnerDetails[0],
            })
          );
        }
      }
    }
  }, [
    txHash,
    encryptionKey,
    deletedOwnerDetails,
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
        description: `Removing owner from the Safe`,
      },
    ];
    setDeletedOwnerDetails(deletedOwnerDetails);

    await deleteSafeOwner({
      owner: ownerAddress,
      safeOwners: safeOwners.map(({ owner }) => owner),
      newThreshold: values.threshold.value,
      isMultiOwner,
      createNonce: nonce,
      isMetaEnabled,
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
            width="8rem"
            options={thresholdOptions}
            placeholder={`Select Threshold...`}
            defaultValue={{ value: 0, label: 0 }}
          />
          <div className="subtitle mb-0">
            out of {safeOwners.length - 1} owners.
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
