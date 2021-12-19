import React from "react";
import { ThemeProvider } from "styled-components/macro";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import GlobalStyle, { lightTheme, darkTheme } from "global-styles";
import Header from "components/Header";
import NetworkModal from "components/Connect/NetworkModal";

import RegisterPage from "pages/Register/loadable";
import LoginPage from "pages/Login/loadable";
import DashboardPage from "./Dashboard/loadable";
import AcceptInvitePage from "./AcceptInvite/loadable";
import DelegateTransfer from "./DelegateTransfer/loadable";
import AdminStatsPage from "./AdminStats";
import SafeActivityPage from "./AdminStats/SafeActivity";
import VerifyUserPage from "./VerifyUser";
import NotFoundPage from "./NotFound/loadable";
import { routeTemplates } from "constants/routes/templates";
import { PortalContainer } from "components/common/PortalContainer";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <React.Fragment>
      <div className="app" id="app">
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <Header />
          <Switch>
            <Route exact path={routeTemplates.login} component={LoginPage} />
            <Route
              exact
              path={routeTemplates.signup}
              component={RegisterPage}
            />
            <Route
              path={routeTemplates.dashboard.root}
              component={DashboardPage}
            />
            <Route
              path={routeTemplates.acceptInvite}
              component={AcceptInvitePage}
            />
            <Route
              path={routeTemplates.delegateTransfer}
              component={DelegateTransfer}
            />
            <Route
              path={routeTemplates.admin.stats}
              component={AdminStatsPage}
            />
            <Route
              path={routeTemplates.admin.activity}
              component={SafeActivityPage}
            />
            <Route
              path={routeTemplates.verifyUser}
              component={VerifyUserPage}
            />
            <Route component={NotFoundPage} />
          </Switch>
          <GlobalStyle />
          <NetworkModal />
        </ThemeProvider>
      </div>
      <PortalContainer />
    </React.Fragment>
  );
}
