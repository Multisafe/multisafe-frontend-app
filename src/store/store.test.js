/**
 * Test store addons
 */

// import { browserHistory } from 'react-router-dom';
import configureStore from "../index";

describe("configureStore", () => {
  let store;

  beforeAll(() => {
    store = configureStore({});
  });

  describe("injectedReducers", () => {
    it("should contain an object for reducers", () => {
      expect(typeof store.injectedReducers).toBe("object");
    });
  });

  describe("injectedSagas", () => {
    it("should contain an object for sagas", () => {
      expect(typeof store.injectedSagas).toBe("object");
    });
  });

  describe("runSaga", () => {
    it("should contain a hook for `sagaMiddleware.run`", () => {
      expect(typeof store.runSaga).toBe("function");
    });
  });
});

describe("configureStore params", () => {
  it("should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__", () => {
    /* eslint-disable no-underscore-dangle */
    const compose = jest.fn();
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = () => compose;
    configureStore(undefined);
    expect(compose).toHaveBeenCalled();
    /* eslint-enable */
  });
});
