// When user switches between connected accounts in MetaMask for ex,
// show "Sign and Login". If that address is an owner, login else logout
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { cryptoUtils } from "coinshift-sdk";

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
import { makeSelectLoading as makeSelectLoggingIn } from "store/login/selectors";
import {
  makeSelectLoading,
  makeSelectSafes,
} from "store/loginWizard/selectors";
import LoadingIndicator from "components/common/Loading/PageLoader";
import Img from "components/common/Img";
import MultisafeLogo from "assets/images/multisafe-logo.svg";

import { Background, InnerCard } from "components/Login/styles";
import { setReadOnly } from "store/global/actions";
import {
  makeSelectIsDataSharingAllowed,
  makeSelectSafeInfoSuccess,
} from "store/global/selectors";
import { routeGenerators } from "constants/routes/generators";
import { getPassword } from "utils/encryption";

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
  const history = useHistory();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });
  useInjectSaga({ key: logoutKey, saga: logoutSaga });

  const loading = useSelector(makeSelectLoading());
  const safes = useSelector(makeSelectSafes());
  const loggingIn = useSelector(makeSelectLoggingIn());
  const safeInfoSuccess = useSelector(makeSelectSafeInfoSuccess());
  const dataSharingAllowed = useSelector(makeSelectIsDataSharingAllowed());

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

          if (!safe && safeInfoSuccess) {
            if (dataSharingAllowed) {
              dispatch(setReadOnly(true));
              setSigning(false);
              history.push(
                routeGenerators.dashboard.root({
                  safeAddress: params.safeAddress,
                })
              );
            } else {
              dispatch(setReadOnly(false));
              dispatch(logoutUser());
            }
          }

          try {
            const encryptionKey = await getEncryptionKey(
              safe.encryptionKeyData,
              signature,
              safe.organisationType
            );
            setEncryptionKey(encryptionKey);

            const password = getPassword(signature);
            dispatch(
              loginUser({
                safeAddress: params.safeAddress,
                encryptionKeyData: safe.encryptionKeyData,
                password,
                owner: account,
              })
            );
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
    } else {
      dispatch(logoutUser());
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Background>
      <div>
        <Img
          src={"https://images.multisafe.finance/landing-page/welcome-new.png"}
          alt="welcome"
          width="70%"
          className="d-block mx-auto py-4"
        />
        <InnerCard>
          <h2 className="text-center mb-4">
            <Img src={MultisafeLogo} alt="multisafe" width="80" />
          </h2>
          <div className="mt-2 title">
            Please sign to verify your account and proceed.
          </div>

          <Button
            type="button"
            className="mx-auto d-block mt-3"
            onClick={signTerms}
            loading={signing || loggingIn}
            disabled={signing || loggingIn}
          >
            Sign and Proceed
          </Button>
        </InnerCard>
      </div>
    </Background>
  );
};

export default VerifyUser;
