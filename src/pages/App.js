import React from "react";
import { ThemeProvider } from "styled-components";
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
import VerifyUserPage from "./VerifyUser";
import NotFoundPage from "./NotFound/loadable";
import { routeTemplates } from "constants/routes/templates";
import VisitCoinshiftModal from "components/VisitCoinshiftModal";

export default function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div className="app">
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Header />
        <Switch>
          <Route exact path={routeTemplates.login} component={LoginPage} />
          <Route exact path={routeTemplates.signup} component={RegisterPage} />
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
          <Route path={routeTemplates.adminStats} component={AdminStatsPage} />
          <Route path={routeTemplates.verifyUser} component={VerifyUserPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
        <NetworkModal />
        <VisitCoinshiftModal />
      </ThemeProvider>
    </div>
  );
}
