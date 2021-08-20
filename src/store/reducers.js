/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { reducer as modal } from "redux-modal";

import globalReducer from "./global/reducer";
import themeReducer from "./theme/reducer";
import history from "utils/history";
import { LOGOUT_USER } from "./logout/action-types";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const appReducer = combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    theme: themeReducer,
    modal,
    ...injectedReducers,
  });

  const rootReducer = (state, action) => {
    if (action.type === LOGOUT_USER) {
      return appReducer(undefined, action);
    }

    return appReducer(state, action);
  };

  return rootReducer;
}
