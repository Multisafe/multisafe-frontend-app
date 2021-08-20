// TODO: When user switches between connected accounts in MetaMask for ex,
// show "Sign and Login". If that addr is an owner, login else logout
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import Button from "components/common/Button";
import { useActiveWeb3React, useEncryptionKey, useLocalStorage } from "hooks";
import { MESSAGE_TO_SIGN } from "constants/index";
import { logoutUser } from "store/logout/actions";
import { getParcelSafes } from "store/loginWizard/actions";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
import logoutSaga from "store/logout/saga";
import { loginUser } from "store/login/actions";
import {
  makeSelectLoading,
  makeSelectSafes,
} from "store/loginWizard/selectors";
import LoadingIndicator from "components/common/Loading/PageLoader";

const loginKey = "login";
const loginWizardKey = "loginWizard";
const logoutKey = "logout";

const VerifyUser = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");
  const [, setEncryptionKey] = useEncryptionKey();
  const [signing, setSigning] = useState(false);

  const { account, library } = useActiveWeb3React();

  const dispatch = useDispatch();
  const params = useParams();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });
  useInjectSaga({ key: logoutKey, saga: logoutSaga });

  const loading = useSelector(makeSelectLoading());
  const safes = useSelector(makeSelectSafes());

  useEffect(() => {
    if (account) dispatch(getParcelSafes(account));
  }, [dispatch, account]);

  const getEncryptionKey = async (data, sign, organisationType) => {
    try {
      const encryptionKey = await cryptoUtils.decryptUsingSignatures(
        data,
        sign,
        organisationType
      );
      return encryptionKey;
    } catch (err) {
      console.error(err);
      dispatch(logoutUser());
      return "";
    }
  };

  const signTerms = async () => {
    if (!!library && !!account) {
      setSigning(true);
      try {
        let signature = sign;

        signature = await library
          .getSigner(account)
          .signMessage(MESSAGE_TO_SIGN);

        setSign(signature);
        setSigning(false);

        if (safes.length) {
          const safe = safes.find(
            ({ safeAddress }) => safeAddress === params.safeAddress
          );

          if (!safe) dispatch(logoutUser());

          try {
            const encryptionKey = await getEncryptionKey(
              safe.encryptionKeyData,
              signature,
              safe.organisationType
            );
            setEncryptionKey(encryptionKey);
            dispatch(loginUser(params.safeAddress, safe.encryptionKeyData));
          } catch (err) {
            console.error(err);
          }
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error(error);
        setSigning(false);
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="m-5">
      <Button onClick={signTerms} disabled={signing} loading={signing}>
        Sign and Login
      </Button>
    </div>
  );
};

export default VerifyUser;
