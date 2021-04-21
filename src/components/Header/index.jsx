import React from "react";
import { useLocation, useHistory } from "react-router-dom";

import { HeaderLink, NavBar, NavBarContent, NavGroup } from "./styles";

import ConnectButton from "components/Connect";
// import DashboardHeader from "./DashboardHeader";
import { useActiveWeb3React } from "hooks";
import Button from "components/common/Button";
import ParcelLogo from "assets/images/parcel-logo-purple.png";

function PlainHeader() {
  const location = useLocation();
  const history = useHistory();
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";
  const { account } = useActiveWeb3React();

  const renderSignUpButton = () => (
    <Button
      type="button"
      onClick={() => {
        const searchParams = new URLSearchParams(location.search);
        history.push({ pathname: "/signup", search: searchParams.toString() });
      }}
      className="secondary ml-3 py-2 px-4"
    >
      Sign Up
    </Button>
  );
  const renderLoginButton = () => (
    <Button
      type="button"
      onClick={() => {
        const searchParams = new URLSearchParams(location.search);
        history.push({ pathname: "/", search: searchParams.toString() });
      }}
      className="secondary ml-3 py-2 px-4"
    >
      Login
    </Button>
  );

  return (
    <div>
      <NavBar white>
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <HeaderLink to="/" className="dashboard-link">
              <img src={ParcelLogo} alt="parcel" width="160" />
            </HeaderLink>
          </div>
          <NavGroup>
            {!account && (
              <ConnectButton className="py-2 px-4 secondary">
                Connect
              </ConnectButton>
            )}
            {isLoginPage && renderSignUpButton()}
            {isSignupPage && renderLoginButton()}
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
export default function Header() {
  const location = useLocation();

  if (location.pathname.includes("/dashboard")) return null;

  return <PlainHeader />;
}
