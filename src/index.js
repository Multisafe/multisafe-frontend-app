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

import { Web3ReactProvider } from "@web3-react/core";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
// import { NetworkContextName } from "constants/index";
import history from "utils/history";
import getLibrary from "utils/getLibrary";
import Web3ReactManager from "components/hoc/Web3ReactManager";
import App from "./pages/App";
import configureStore from "store";

const initialState = {};
const store = configureStore(initialState, history);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Web3ReactManager>
      </Web3ReactProvider>
    </PersistGate>
  </Provider>,
  document.querySelector("#root")
);
