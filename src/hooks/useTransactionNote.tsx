import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import xss from "xss";
//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";
import { TxDetails } from "store/multisig/types";
import { createOrUpdateTransactionNote } from "store/multisig/actions";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { useActiveWeb3React } from "hooks";
import { useEncryptionKey } from "hooks";
import { getDecryptedDetails } from "utils/encryption";

const SUCCESS_TIMEOUT = 5000;
const MAX_LENGTH = 500;

export const useTransactionNote = (txDetails: TxDetails) => {
  const dispatch = useDispatch();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account, chainId } = useActiveWeb3React();

  const [encryptionKey] = useEncryptionKey();
  const organisationType = useSelector(makeSelectOrganisationType());

  const { notes, transactionId, transactionHash, origin } = txDetails;

  const decrypedTransactionNote = notes
    ? getDecryptedDetails(notes, encryptionKey, organisationType, false)
    : "";
  const [initialNote, setInitialNote] = useState(decrypedTransactionNote);
  const [editedNote, setEditedNote] = useState(decrypedTransactionNote);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newNote = notes
      ? getDecryptedDetails(notes, encryptionKey, organisationType, false)
      : "";
    setInitialNote(newNote);
    setEditedNote(newNote);
  }, [notes, encryptionKey, organisationType]);

  const onChange = (e: FixMe) => {
    const value = e.target?.value;
    setEditedNote(e.target?.value || "");

    if (value.length > MAX_LENGTH) {
      setWarning("Limit 500 characters");
    } else if (!!warning) {
      setWarning("");
    }
  };

  const onError = () => {
    setLoading(false);
    setError("Error updating note");
  };

  const onUpdateClick = async () => {
    const sanitizedNote = xss(editedNote, {
      stripIgnoreTag: true,
      whiteList: {},
    }).trim();

    const encryptedNote = sanitizedNote
      ? cryptoUtils.encryptDataUsingEncryptionKey(
          sanitizedNote,
          encryptionKey,
          organisationType
        )
      : "";

    setError("");
    setSuccess("");
    setLoading(true);

    const body = transactionId
      ? {
          transactionId,
          notes: encryptedNote,
          updatedBy: account,
        }
      : {
          networkId: chainId,
          transactionHash,
          notes: encryptedNote,
          createdBy: account,
          safeAddress,
          origin,
        };

    dispatch(
      createOrUpdateTransactionNote(
        transactionId,
        transactionHash,
        encryptedNote,
        body,
        onError,
        onSuccessUpdate
      )
    );
  };

  const onSuccessUpdate = () => {
    setLoading(false);
    setSuccess("Note updated");

    setTimeout(() => {
      setSuccess("");
    }, SUCCESS_TIMEOUT);
  };

  return {
    notes,
    editedNote,
    onChange,
    onUpdateClick,
    disabled: initialNote === editedNote || !!warning,
    loading,
    error,
    warning,
    success,
  };
};
