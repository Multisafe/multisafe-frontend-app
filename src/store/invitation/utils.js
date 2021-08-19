import { getDecryptedDetails } from "utils/encryption";

const NEW_OWNER = "New Owner";
const ZEROES = "0000";

export function getDecryptedOwnerName({
  encryptedName,
  encryptionKey,
  organisationType,
}) {
  if (!encryptionKey || !encryptedName) return "";

  const isOwnerWithoutName = encryptedName === ZEROES ? true : false;

  const name = isOwnerWithoutName
    ? NEW_OWNER
    : getDecryptedDetails(
        encryptedName,
        encryptionKey,
        organisationType,
        false
      );

  return name;
}
