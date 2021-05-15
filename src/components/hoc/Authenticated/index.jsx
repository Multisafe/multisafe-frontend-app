import { useEffect, useRef } from "react";
import { useAuth } from "hooks";
import { useHistory } from "react-router-dom";

export default function Authenticated({ children }) {
  const isAuthenticated = useAuth();
  const authRef = useRef();
  const history = useHistory();

  authRef.current = isAuthenticated;

  useEffect(() => {
    setTimeout(() => {
      if (!authRef.current) {
        history.push("/");
      }
      return children;
    }, 1500);
  }, [children, history]);

  return children;
}
