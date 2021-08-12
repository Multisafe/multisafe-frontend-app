import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cryptoUtils } from "parcel-sdk";
import { useHistory } from "react-router-dom";

import { useActiveWeb3React, useLocalStorage, useEncryptionKey } from "hooks";
import { useInjectReducer } from "utils/injectReducer";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectLoading,
  makeSelectSafes,
} from "store/loginWizard/selectors";
import { getParcelSafes } from "store/loginWizard/actions";
import {
  setOwnerDetails,
  setOwnersAndThreshold,
  setOrganisationType,
  getSafeInfo,
} from "store/global/actions";
import Loading from "components/common/Loading";
import { routeGenerators } from "constants/routes/generators";

const loginKey = "login";
const loginWizardKey = "loginWizard";

export default function SwitchAccounts() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [, setEncryptionKey] = useEncryptionKey();

  const { account } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });

  const dispatch = useDispatch();
  const history = useHistory();

  const safes = useSelector(makeSelectSafes());
  const loadingSafes = useSelector(makeSelectLoading());

  useEffect(() => {
    if (account) dispatch(getParcelSafes(account));
  }, [dispatch, account]);

  if (loadingSafes)
    return (
      <div className="d-flex align-items-center justify-content-center mt-4">
        <Loading color="primary" width="3rem" height="3rem" />
      </div>
    );

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
      return "";
    }
  };

  const handleSwitchSafe = async ({
    safeAddress,
    encryptionKeyData,
    organisationType,
  }) => {
    const encryptionKey = await getEncryptionKey(
      encryptionKeyData,
      sign,
      organisationType
    );
    setEncryptionKey(encryptionKey, safeAddress);
    history.push(routeGenerators.dashboard.root({ safeAddress }));
  };

  const renderSafes = () => {
    if (!safes) return null;

    return safes.map(
      ({ safeAddress, name, encryptionKeyData, organisationType }, idx) => (
        <div
          key={`${safeAddress}-${idx}`}
          className="settings-option"
          onClick={() =>
            handleSwitchSafe({
              safeAddress,
              encryptionKeyData,
              organisationType,
            })
          }
        >
          <div className="name">{name}</div>
          <div className="name">{safeAddress}</div>
        </div>
      )
    );
  };

  return renderSafes();
}
