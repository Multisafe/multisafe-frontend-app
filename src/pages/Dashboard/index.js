import React, { useEffect } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Dashboard from "components/Dashboard/loadable";
import People from "components/People/loadable";
import Exchange from "components/Exchange/loadable";
import Transactions from "components/Transactions";
import Assets from "components/Assets/loadable";
import TransactionDetails from "components/TransactionDetails/loadable";
import Settings from "components/Settings/loadable";
import Authenticated from "components/Authenticated";
import NotFoundPage from "pages/NotFound/loadable";
import {
  makeSelectIsReadOnly,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { ToastMessage } from "components/common/Toast";
import DashboardLayout from "components/DashboardLayout";
import { routeTemplates } from "constants/routes/templates";
import { useActiveWeb3React, useSocket } from "hooks";
import {
  clearGlobalState,
  getSafeInfo,
  setSafeAddress,
} from "store/global/actions";
import { useInjectSaga } from "utils/injectSaga";
import globalSaga from "store/global/saga";
import { useInjectReducer } from "utils/injectReducer";
import safeSettingsSaga from "store/safeSettings/saga";
import safeSettingsReducer, {
  safeSettingsKey,
} from "store/safeSettings/reducer";
import { getSafeSettings } from "store/safeSettings/actions";
import {
  FEATURE_NAMES,
  useFeatureManagement,
} from "hooks/useFeatureManagement";

const globalKey = "global";

const DashboardPage = () => {
  const isReadOnly = useSelector(makeSelectIsReadOnly());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account, chainId } = useActiveWeb3React();
  const params = useParams();
  const { isFeatureEnabled } = useFeatureManagement();

  useSocket({ safeAddress: params.safeAddress, isReadOnly });

  useInjectSaga({ key: globalKey, saga: globalSaga });

  useInjectSaga({ key: safeSettingsKey, saga: safeSettingsSaga });
  useInjectReducer({ key: safeSettingsKey, reducer: safeSettingsReducer });

  const dispatch = useDispatch();

  useEffect(() => {
    if (safeAddress !== params.safeAddress) {
      dispatch(clearGlobalState());
      dispatch(setSafeAddress(params.safeAddress));
    }

    if (safeAddress && safeAddress === params.safeAddress) {
      dispatch(getSafeInfo(safeAddress, account));
    }

    if (safeAddress && chainId) {
      dispatch(getSafeSettings({ safeAddress, networkId: chainId }));
    }
  }, [dispatch, params.safeAddress, account, safeAddress, chainId]);

  return (
    <Authenticated>
      <DashboardLayout>
        <Switch>
          <Route
            exact
            path={routeTemplates.dashboard.root}
            component={Dashboard}
          />
          <Route
            exact
            path={routeTemplates.dashboard.people}
            component={People}
          />
          {isFeatureEnabled(FEATURE_NAMES.TOKEN_SWAP) ? (
            <Route
              exact
              path={routeTemplates.dashboard.exchange}
              component={Exchange}
            />
          ) : null}
          <Route
            exact
            path={routeTemplates.dashboard.transactions}
            component={Transactions}
          />
          <Route
            exact
            path={routeTemplates.dashboard.transactionById}
            component={TransactionDetails}
          />
          <Route
            exact
            path={routeTemplates.dashboard.assets}
            component={Assets}
          />
          <Route
            exact
            path={routeTemplates.dashboard.settings}
            component={Settings}
          />
          <Route component={NotFoundPage} />
        </Switch>
        <ToastMessage />
      </DashboardLayout>
    </Authenticated>
  );
};

export default DashboardPage;
