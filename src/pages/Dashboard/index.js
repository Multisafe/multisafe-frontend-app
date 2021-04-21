import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

// import Dashboard from "components/Dashboard-old";
import Dashboard from "components/Dashboard";
import People from "components/People";
// import AddTeammate from "components/People/AddTeammate";
import AddDepartment from "components/People/AddDepartment";
import ViewTeammates from "components/People/ViewTeammates";
import EditTeammate from "components/People/EditTeammate";
import Payments from "components/Payments";
import Transactions from "components/Transactions";
import AccountSummary from "components/AccountSummary";
import MultiSigTransactions from "components/Transactions/MultiSigTransactions";
import MultiSigTransactionDetails from "components/Transactions/MultiSigTransactionDetails";
import TransactionDetails from "components/Transactions/TransactionDetails";
import QuickTransfer from "components/QuickTransfer";
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
import { useSocket } from "hooks";
import DashboardLayout from "components/DashboardLayout";
import { routeTemplates } from "constants/routes/templates";
// import { closeNotifications } from "store/notifications/actions";
// import { makeSelectShowNotifications } from "store/notifications/selectors";

const DashboardPage = () => {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  useSocket({ isMultiOwner, safeAddress });

  // const showNotifications = useSelector(makeSelectShowNotifications());
  // const dispatch = useDispatch();

  // const closeNotificationsIfOpen = () => {
  //   if (showNotifications) dispatch(closeNotifications());
  // };

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
            path={routeTemplates.dashboard.people.view}
            component={ViewTeammates}
          />
          <Route
            exact
            path={routeTemplates.dashboard.people.viewByDepartment}
            component={ViewTeammates}
          />
          <Route
            exact
            path={routeTemplates.dashboard.people.edit}
            component={EditTeammate}
          />
          <Route
            exact
            path={routeTemplates.dashboard.department.new}
            component={AddDepartment}
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
            path={routeTemplates.dashboard.quickTransfer}
            component={QuickTransfer}
          />
          <Route
            exact
            path={routeTemplates.dashboard.account}
            component={AccountSummary}
          />
          <Route
            exact
            path={routeTemplates.dashboard.owners}
            component={InviteOwners}
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
