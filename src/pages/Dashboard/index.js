import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Dashboard from "components/Dashboard";
import People from "components/People";
import Payments from "components/Payments";
import Transactions from "components/Transactions";
import Assets from "components/Assets";
import MultiSigTransactions from "components/Transactions/MultiSigTransactions";
import MultiSigTransactionDetails from "components/Transactions/MultiSigTransactionDetails";
import TransactionDetails from "components/Transactions/TransactionDetails";
import Settings from "components/Settings";
import InviteOwners from "components/InviteOwners";
import SpendingLimits from "components/SpendingLimits";
import NewSpendingLimit from "components/SpendingLimits/NewSpendingLimit";
import Authenticated from "components/hoc/Authenticated";
import NotFoundPage from "pages/NotFound";
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
            path={routeTemplates.dashboard.payments}
            component={Payments}
          />
          <Route
            exact
            path={routeTemplates.dashboard.transactions}
            component={isMultiOwner ? MultiSigTransactions : Transactions}
          />
          <Route
            exact
            path={routeTemplates.dashboard.transactionById}
            component={
              isMultiOwner ? MultiSigTransactionDetails : TransactionDetails
            }
          />
          <Route
            exact
            path={routeTemplates.dashboard.assets}
            component={Assets}
          />
          <Route
            exact
            path={routeTemplates.dashboard.owners}
            component={InviteOwners}
          />
          <Route
            exact
            path={routeTemplates.dashboard.settings}
            component={Settings}
          />
          <Route
            exact
            path={routeTemplates.dashboard.spendingLimits.root}
            component={SpendingLimits}
          />
          <Route
            exact
            path={routeTemplates.dashboard.spendingLimits.new}
            component={NewSpendingLimit}
          />
          <Route component={NotFoundPage} />
        </Switch>
        <ToastMessage />
      </DashboardLayout>
    </Authenticated>
  );
};

export default DashboardPage;
