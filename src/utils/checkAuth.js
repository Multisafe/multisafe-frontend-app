import jwt_decode from "jwt-decode";
import { ethers } from "ethers";
import { MESSAGE_TO_SIGN } from "constants/index";

export function checkValidSignature(sign, account) {
  if (!sign) return false;

  const msgHash = ethers.utils.hashMessage(MESSAGE_TO_SIGN);
  const recoveredAddress = ethers.utils.recoverAddress(msgHash, sign);

  return recoveredAddress === account;
}

export function checkValidAccessToken(safeAddress) {
  const access_token = localStorage.getItem("token");
  if (!access_token || !safeAddress) return false;
  try {
    const decoded = jwt_decode(access_token);
    if (decoded.safeAddress !== safeAddress) return false;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
