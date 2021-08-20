import { useAuth } from "hooks";

import { WALLET_STATES } from "constants/index";
import LoadingIndicator from "components/common/Loading/PageLoader";

export default function Authenticated({ children }) {
  const { walletState } = useAuth();

  if (walletState === WALLET_STATES.UNDETECTED) {
    return <LoadingIndicator />;
  }

  return children;
}
