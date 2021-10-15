import {useState, useEffect, SyntheticEvent} from "react";
import { useDispatch, useSelector } from "react-redux";
import xss from 'xss';
//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";
import { TxDetails } from "store/multisig/types";
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
import {safeDecrypt} from 'utils/safeDecrypt';

const SUCCESS_TIMEOUT = 5000;
const MAX_LENGTH = 500;

export const useTransactionNote = (txDetails: TxDetails) => {
  const dispatch = useDispatch();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account, chainId } = useActiveWeb3React();

  const [encryptionKey] = useEncryptionKey();
  const organisationType = useSelector(makeSelectOrganisationType());

  const { notes, transactionId, transactionHash, origin } = txDetails;

  const [initialNote, setInitialNote] = useState(
    notes
      ? safeDecrypt(
          notes,
          encryptionKey,
          organisationType
        )
      : ""
  );
  const [editedNote, setEditedNote] = useState(
    notes
      ? safeDecrypt(
          notes,
          encryptionKey,
          organisationType
        )
      : ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newNote = notes
      ? safeDecrypt(
          notes,
          encryptionKey,
          organisationType
        )
      : "";
    setInitialNote(newNote);
    setEditedNote(newNote);
  }, [notes, encryptionKey, organisationType]);

  const onChange = (e: FixMe) => {
    const value = e.target?.value;
    setEditedNote(e.target?.value || "");

    if (value.length > MAX_LENGTH) {
      setWarning('Limit 500 characters');
    } else if (!!warning) {
      setWarning('');
    }
  };

  const onUpdateClick = async () => {
    const sanitizedNote = xss(editedNote, {stripIgnoreTag: true, whiteList: {}}).trim();

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
    disabled: initialNote === editedNote || !!warning,
    loading,
    error,
    warning,
    success
  };
};
