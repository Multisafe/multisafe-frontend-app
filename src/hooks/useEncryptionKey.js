// import { useParams } from "react-router-dom";

import { useLocalStorage } from "./index";

const ENCRYPTION_KEY = "ENCRYPTION_KEY";

export default function useEncryptionKey() {
  const [encryptionKey, setEncryptionKey] = useLocalStorage(ENCRYPTION_KEY);

  return [encryptionKey, setEncryptionKey];
}
