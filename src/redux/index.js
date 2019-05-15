import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas/rootSaga";
import radar from "./modules/radarImages";
import zip from "./modules/zip";

const reducer = combineReducers({
  radar,
  zip,
});

const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware);

export default function createAppStore(initialValue = {}) {
  let store;

  if (process.env.NODE_ENV === "development") {
    // Development mode with Redux DevTools support enabled.
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Prevents Redux DevTools from re-dispatching all previous actions.
          shouldHotReload: false,
        })
      : compose;
    // Create the redux store.
    store = createStore(reducer, initialValue, composeEnhancers(middleware));
  } else {
    // Production mode.
    store = createStore(reducer, initialValue, middleware);
  }

  sagaMiddleware.run(rootSaga);

  return store;
}
