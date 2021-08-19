/**
 * index.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import localForage from "localforage";
import { persistStore } from "redux-persist";

import history from "utils/history";
import App from "./pages/App";
import configureStore from "store/index";
import Web3ReactProvider from "context/Web3ReactContext";

const initialState = {};
const store = configureStore(initialState, history);

// Config for redux-persist
const persistConfig = {
  key: "root",
  storage: localForage,
  // NOTE: ONLY KEEP MOST IMP DATA HERE
  whitelist: ["global"], // global state will pe persisted
};
window.persistor = persistStore(store, persistConfig);

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Web3ReactProvider>
  </Provider>,
  document.querySelector("#root")
);
