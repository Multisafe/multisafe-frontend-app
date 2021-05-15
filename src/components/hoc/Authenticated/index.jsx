import { useRef } from "react";
import { useAuth } from "hooks";
import { useHistory } from "react-router-dom";
import Loading from "components/common/Loading";

// TODO:
export default function Authenticated({ children }) {
  const isAuthenticated = useAuth();
  const authRef = useRef();
  const history = useHistory();

  authRef.current = isAuthenticated;

  const redirectAfterDelay = () => {
    setTimeout(() => {
      if (!authRef.current) {
        history.push("/");
      }
      return children;
    }, 3000);

    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Loading color="primary" width="3rem" height="3rem" />
      </div>
    );
  };

  return isAuthenticated ? children : redirectAfterDelay();
}
