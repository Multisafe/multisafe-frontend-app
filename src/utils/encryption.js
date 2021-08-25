import { cryptoUtils } from "coinshift-sdk";
import { ORGANISATION_TYPE } from "store/login/resources";

export const getPublicKey = (sign) => {
  const publicKey = cryptoUtils.getPublicKey(sign);

  return publicKey;
};

export const getDecryptedDetails = (
  data,
  encryptionKey,
  organisationType,
  parse = true
) => {
  if (!data || organisationType === undefined) return "";
  if (organisationType === ORGANISATION_TYPE.PRIVATE && !encryptionKey)
    return "";

  try {
    const decryptedData = cryptoUtils.decryptDataUsingEncryptionKey(
      data,
      encryptionKey,
      organisationType
    );

    return parse ? JSON.parse(decryptedData) : decryptedData;
  } catch (err) {
    console.error(err);
    return "";
  }
};
