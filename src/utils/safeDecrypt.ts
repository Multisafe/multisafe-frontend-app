//@ts-ignore
import { cryptoUtils } from "coinshift-sdk";

export const safeDecrypt = (data: string, encryptionKey: string, organisationType: number) => {
  let result;

  try {
    result = cryptoUtils.decryptDataUsingEncryptionKey(
      data,
      encryptionKey,
      organisationType
    );
  } catch {
    result = '';
    console.error("Decryption Error");
  }

  return result;
}
