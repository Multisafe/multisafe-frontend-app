import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Dashboard from "components/Dashboard/loadable";
import People from "components/People/loadable";
import Transactions from "components/Transactions/loadable";
import Assets from "components/Assets/loadable";
import TransactionDetails from "components/TransactionDetails/loadable";
import Settings from "components/Settings/loadable";
import Authenticated from "components/hoc/Authenticated";
import NotFoundPage from "pages/NotFound/loadable";
import {
  makeSelectIsMultiOwner,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { ToastMessage } from "components/common/Toast";
import DashboardLayout from "components/DashboardLayout";
import { routeTemplates } from "constants/routes/templates";
import { useActiveWeb3React, useSocket } from "hooks";
import { getSafeInfo } from "store/global/actions";
import { useInjectSaga } from "utils/injectSaga";
import globalSaga from "store/global/saga";

const globalKey = "global";

const DashboardPage = () => {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const { account } = useActiveWeb3React();
  useSocket({ isMultiOwner, safeAddress });

  useInjectSaga({ key: globalKey, saga: globalSaga });

  const dispatch = useDispatch();

  useEffect(() => {
    if (safeAddress && account) dispatch(getSafeInfo(safeAddress, account));
  }, [dispatch, safeAddress, account]);

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
            path={routeTemplates.dashboard.people.root}
            component={People}
          />
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
