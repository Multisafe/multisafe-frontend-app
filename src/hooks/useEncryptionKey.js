import { useParams } from "react-router-dom";

import { useLocalStorage } from "./index";

const ENCRYPTION_KEY = "ENCRYPTION_KEY";

export default function useEncryptionKey() {
  const [encryptionKeyMap, setEncryptionKeyMap] =
    useLocalStorage(ENCRYPTION_KEY);

  const params = useParams();

  const setEncryptionKey = (encryptionKey, safeAddress) => {
    if (!encryptionKey || !safeAddress) return;

    setEncryptionKeyMap({ ...encryptionKeyMap, [safeAddress]: encryptionKey });
  };

  const encryptionKey = params.safeAddress
    ? encryptionKeyMap[params.safeAddress]
    : "";

  return [encryptionKey, setEncryptionKey];
}
