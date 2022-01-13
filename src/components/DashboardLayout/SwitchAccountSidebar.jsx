import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cryptoUtils } from "coinshift-sdk";

import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import Img from "components/common/Img";
import CloseIcon from "assets/icons/navbar/close.svg";
import { makeSelectIsSwitchAccountOpen } from "store/layout/selectors";
import { toggleSwitchAccount } from "store/layout/actions";
import { useActiveWeb3React, useLocalStorage, useEncryptionKey } from "hooks";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import {
  makeSelectLoading,
  makeSelectSafes,
} from "store/loginWizard/selectors";
import { getParcelSafes } from "store/loginWizard/actions";
import Loading from "components/common/Loading";
import { loginUser } from "store/login/actions";
import SearchIcon from "assets/icons/dashboard/search-icon.svg";
import ControlledInput from "components/common/Input";
import { getPassword } from "utils/encryption";

import { SwitchAccountMenu } from "./styles";
import { NETWORK_NAME_BY_ID, SUPPORTED_NETWORK_IDS } from "constants/networks";
import { SwitchSafeNetworkLabel } from "components/DashboardLayout/styles/SwitchAccountMenu";

const loginKey = "login";
const loginWizardKey = "loginWizard";

const sidebarStyles = {
  bmCrossButton: {
    height: "2.4rem",
    width: "2.4rem",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    top: "0",
  },
  bmMenu: {
    background: "#fff",
  },
  bmMorphShape: {
    fill: "#fff",
  },
  bmItemList: {
    color: "#373737",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.05)",
    top: "0",
  },
};

function SwitchAccountSidebar() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [, setEncryptionKey] = useEncryptionKey();
  const [safesToShow, setSafesToShow] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const { account, setChainId, chainId } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });

  const dispatch = useDispatch();

  const safes = useSelector(makeSelectSafes());
  const loadingSafes = useSelector(makeSelectLoading());
  const isSwitchAccountOpen = useSelector(makeSelectIsSwitchAccountOpen());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (account) dispatch(getParcelSafes(account));
  }, [dispatch, account]);

  useEffect(() => {
    if (safes && safes.length) setSafesToShow(safes);
  }, [safes]);

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
    safe,
    encryptionKeyData,
    organisationType,
    networkId,
  }) => {
    const encryptionKey = await getEncryptionKey(
      encryptionKeyData,
      sign,
      organisationType
    );
    setEncryptionKey(encryptionKey);
    closeSidebar();
    const password = getPassword(sign);

    if (safeAddress !== safe) {
      setChainId(networkId);
      dispatch(
        loginUser({
          safeAddress: safe,
          encryptionKeyData,
          password,
          owner: account,
          networkId,
        })
      );
    }
  };

  const renderSafes = () => {
    if (!safesToShow || !safesToShow.length)
      return <div className="no-safes">No safes found</div>;

    const sortedNetworkIds = [...new Set([chainId, ...SUPPORTED_NETWORK_IDS])];

    const sortedGroups = sortedNetworkIds.reduce((acc, currNetworkId) => {
      return [
        ...acc,
        {
          networkId: currNetworkId,
          safes: safesToShow.filter(
            ({ networkId }) => networkId === currNetworkId
          ),
        },
      ];
    }, []);

    return sortedGroups.map(({ networkId, safes }) => {
      return safes?.length ? (
        <div>
          <SwitchSafeNetworkLabel>
            {NETWORK_NAME_BY_ID[networkId]}
          </SwitchSafeNetworkLabel>
          {safes.map(
            ({
              safeAddress: safe,
              name,
              encryptionKeyData,
              organisationType,
            }) => (
              <div
                key={`${safe}`}
                className="safe-option"
                style={{
                  backgroundColor:
                    safe === safeAddress ? "rgba(221, 220, 220, 0.2)" : "#fff",
                }}
                onClick={() =>
                  handleSwitchSafe({
                    safe,
                    encryptionKeyData,
                    organisationType,
                    networkId,
                  })
                }
              >
                <div className="name">{name}</div>
                <div className="address">{safe}</div>
              </div>
            )
          )}
        </div>
      ) : null;
    });
  };

  const handleStateChange = (state) => {
    dispatch(toggleSwitchAccount(state.isOpen));
  };

  const closeSidebar = () => {
    dispatch(toggleSwitchAccount(false));
  };

  const handleSearchSafes = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!safes) return;

    if (term) {
      setSafesToShow(
        safes.filter(({ name }) =>
          name.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setSafesToShow(safes);
    }
  };

  return (
    <SwitchAccountMenu
      styles={sidebarStyles}
      left
      customBurgerIcon={false}
      customCrossIcon={false}
      disableAutoFocus
      isOpen={isSwitchAccountOpen}
      onStateChange={(state) => handleStateChange(state)}
      width={380}
    >
      <div className="switch-account-header">
        <div className="title">Switch Account</div>
        <div className="close" onClick={closeSidebar}>
          <Img src={CloseIcon} alt="close" />
        </div>
      </div>
      <div className="search-safes">
        <Img src={SearchIcon} alt="search safes" />
        <div className="w-100">
          <ControlledInput
            type="text"
            className="safe-input"
            id="search-safe"
            name="search-safe"
            placeholder={"Search safe"}
            onChange={handleSearchSafes}
            value={searchTerm}
          />
        </div>
      </div>
      {loadingSafes ? (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      ) : (
        <div className="safes">{renderSafes()}</div>
      )}
    </SwitchAccountMenu>
  );
}

export default memo(SwitchAccountSidebar);
