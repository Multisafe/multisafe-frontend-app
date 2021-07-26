import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
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
} from "store/global/selectors";
import { TRANSACTION_MODES } from "constants/transactions";
import { MODAL_NAME as TX_SUBMITTED_MODAL } from "components/Payments/TransactionSubmittedModal";
import ErrorText from "components/common/ErrorText";
import Avatar from "components/common/Avatar";
import { STEPS } from "store/login/resources";

import { Information } from "components/Register/styles";
import { ReplaceContainer, OwnerDetails } from "./styles";

const transactionsKey = "transactions";
const safeKey = "safe";
const multisigKey = "multisig";
const metaTxKey = "metatx";

export default function ReplaceOwner(props) {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { handleHide, ownerName, ownerAddress } = props;

  const { account } = useActiveWeb3React();
  const [replaceOwnerDetails, setReplacedOwnerDetails] = useState(null);
  const [metaTxHash, setMetaTxHash] = useState();
  const [step, setStep] = useState(STEPS.ZERO);
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const { txHash, loadingTx, replaceSafeOwner, txData } = useMassPayout();
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

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();

  // Selectors
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
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
    if (txHashFromMetaTx) {
      setMetaTxHash(txHashFromMetaTx);
      dispatch(clearTransactionHash());
    }
  }, [dispatch, txHashFromMetaTx]);

  useEffect(() => {
    if (txHash) {
      if (encryptionKey && replaceOwnerDetails && ownerSafeAddress) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(replaceOwnerDetails),
          encryptionKey,
          organisationType
        );

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: ownerSafeAddress,
            transactionHash: txHash,
            transactionMode: TRANSACTION_MODES.REPLACE_SAFE_OWNER,
            metaData: replaceOwnerDetails[0],
          })
        );
      }
    } else if (txData) {
      if (encryptionKey && replaceOwnerDetails && ownerSafeAddress) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(replaceOwnerDetails),
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
              transactionMode: TRANSACTION_MODES.REPLACE_SAFE_OWNER,
              metaData: replaceOwnerDetails[0],
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
              transactionMode: TRANSACTION_MODES.REPLACE_SAFE_OWNER,
              nonce: nonce,
              metaData: replaceOwnerDetails[0],
            })
          );
        }
      }
    }
  }, [
    txHash,
    encryptionKey,
    replaceOwnerDetails,
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
      setReplacedOwnerDetails(replaceOwnerDetails);

      await replaceSafeOwner({
        oldOwner: ownerAddress,
        newOwner: newOwnerAddress,
        safeOwners: safeOwners.map(({ owner }) => owner),
        isMultiOwner,
        createNonce: nonce,
        isMetaEnabled,
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
