import { takeEvery, put } from "redux-saga/effects";
import { push } from "connected-react-router";
import { LOGOUT_USER } from "./action-types";
import { routeTemplates } from "constants/routes/templates";

export function* logout() {
  yield invalidateSession();
}

function* invalidateSession() {
  yield localStorage.removeItem("token");
  yield localStorage.removeItem("ENCRYPTION_KEY");
  yield localStorage.removeItem("SIGNATURE");
  yield localStorage.removeItem("selectedWallet");
  yield put(push(routeTemplates.login));
}

export default function* watchLogout() {
  yield takeEvery(LOGOUT_USER, logout);
}
