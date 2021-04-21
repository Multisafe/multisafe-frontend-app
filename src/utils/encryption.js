import { cryptoUtils } from "parcel-sdk";

export const getPublicKey = (sign) => {
  const publicKey = cryptoUtils.getPublicKey(sign);

  return publicKey;
};

export const getDecryptedDetails = (data, encryptionKey, organisationType) => {
  if (!encryptionKey) return "";
  try {
    return JSON.parse(
      cryptoUtils.decryptDataUsingEncryptionKey(
        data,
        encryptionKey,
        organisationType
      )
    );
  } catch (err) {
    console.error(err);
    return "";
  }
};
