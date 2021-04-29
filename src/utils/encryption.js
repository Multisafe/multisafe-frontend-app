import { cryptoUtils } from "parcel-sdk";

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
  if (!encryptionKey || !data || organisationType === undefined) return {};
  try {
    const decryptedData = cryptoUtils.decryptDataUsingEncryptionKey(
      data,
      encryptionKey,
      organisationType
    );

    return parse ? JSON.parse(decryptedData) : decryptedData;
  } catch (err) {
    console.error(err);
    return {};
  }
};
