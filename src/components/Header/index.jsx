import React from "react";
import { useLocation, useHistory } from "react-router-dom";

import { HeaderLink, NavBar, NavBarContent, NavGroup } from "./styles";

import ConnectButton from "components/Connect";
import { useActiveWeb3React } from "hooks";
import Button from "components/common/Button";
import MultisafeLogo from "assets/images/multisafe-logo.svg";
import Img from "components/common/Img";
import { routeTemplates } from "constants/routes/templates";

function PlainHeader() {
  const location = useLocation();
  const history = useHistory();
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";
  const { account, onboard } = useActiveWeb3React();

  const handleDisconnect = () => {
    if (onboard) {
      onboard.walletReset();
    }
  };

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
            <HeaderLink to={routeTemplates.root} className="dashboard-link">
              <Img src={MultisafeLogo} alt="multisafe" width="80" />
            </HeaderLink>
          </div>
          <NavGroup>
            {!account ? (
              <ConnectButton className="py-2 px-4">Connect</ConnectButton>
            ) : (
              <Button
                className="py-2 px-4 secondary"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
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
