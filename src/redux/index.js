import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas/rootSaga";
import rainRadar from "./modules/rainRadar";
import timeSelection from "./modules/timeSelection";
import permissions from "./modules/permissions";
import pointAnalysis from "./modules/pointAnalysis";
import lightning from "./modules/lightning";
import watchedRequests from "./modules/watchedRequests";
import { logger } from "./middleware/logger.js";

const LOG = true;

const reducer = combineReducers({
  rainRadar,
  timeSelection,
  permissions,
  pointAnalysis,
  lightning,
  watchedRequests,
});

const sagaMiddleware = createSagaMiddleware();
let middleware = null;
if (LOG) {
  middleware = applyMiddleware(sagaMiddleware, logger);
} else {
  middleware = applyMiddleware(sagaMiddleware);
}

export default function createAppStore(initialValue = {}) {
  let store;

  /* eslint-disable no-undef */
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
