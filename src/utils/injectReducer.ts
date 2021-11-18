import React from "react";
import { ReactReduxContext } from "react-redux";

import getInjectors from "./reducerInjectors";

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */

type ReducerProps = {
  key: string;
  reducer: () => void;
};

const useInjectReducer = ({ key, reducer }: ReducerProps) => {
  const context = React.useContext(ReactReduxContext);
  React.useEffect(() => {
    getInjectors(context.store).injectReducer(key, reducer);
  }, []); //eslint-disable-line
};

export { useInjectReducer };
