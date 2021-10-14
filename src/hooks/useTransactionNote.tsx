import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";
import { TxDetails } from "components/Transactions/types";
import request from "utils/request";
import { updateMultisigTransactionNote } from "store/multisig/actions";
import {
  updateTransactionNote,
  createTransactionNote,
} from "constants/endpoints";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { useActiveWeb3React } from "hooks";
import { useEncryptionKey } from "./index";

const SUCCESS_TIMEOUT = 5000;

export const useTransactionNote = (txDetails: TxDetails) => {
  const dispatch = useDispatch();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account, chainId } = useActiveWeb3React();

  const [encryptionKey] = useEncryptionKey();
  const organisationType = useSelector(makeSelectOrganisationType());

  const { notes, transactionId, transactionHash, origin } = txDetails;

  const [initialNote, setInitialNote] = useState(
    notes
      ? cryptoUtils.decryptDataUsingEncryptionKey(
          notes,
          encryptionKey,
          organisationType
        )
      : ""
  );
  const [editedNote, setEditedNote] = useState(
    notes
      ? cryptoUtils.decryptDataUsingEncryptionKey(
          notes,
          encryptionKey,
          organisationType
        )
      : ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newNote = notes
      ? cryptoUtils.decryptDataUsingEncryptionKey(
          notes,
          encryptionKey,
          organisationType
        )
      : "";
    setInitialNote(newNote);
    setEditedNote(newNote);
  }, [notes, encryptionKey, organisationType]);

  const onChange = (e: FixMe) => {
    setEditedNote(e.target?.value || "");
  };

  const onUpdateClick = async () => {
    const encryptedNote = editedNote
      ? cryptoUtils.encryptDataUsingEncryptionKey(
          editedNote,
          encryptionKey,
          organisationType
        )
      : "";

    setError("");
    setSuccess("");
    setLoading(true);
    let result;

    if (transactionId) {
      const body = JSON.stringify({
        transactionId,
        notes: encryptedNote,
        updatedBy: account,
      });

      result = await request(updateTransactionNote, { method: "POST", body });
    } else if (transactionHash) {
      const body = JSON.stringify({
        networkId: chainId,
        transactionHash,
        notes: encryptedNote,
        createdBy: account,
        safeAddress,
        origin,
      });

      result = await request(createTransactionNote, { method: "POST", body });
    }

    if (result.flag !== 200) {
      setError("Error updating note");
    } else {
      dispatch(
        updateMultisigTransactionNote(
          transactionId || result.transactionId,
          transactionHash,
          encryptedNote
        )
      );
    }

    setLoading(false);
    onSuccessUpdate();
  };

  const onSuccessUpdate = () => {
    setSuccess("Note updated");

    setTimeout(() => {
      setSuccess("");
    }, SUCCESS_TIMEOUT);
  }

  return {
    notes,
    editedNote,
    onChange,
    onUpdateClick,
    disabled: initialNote === editedNote,
    loading,
    error,
    success
  };
};
