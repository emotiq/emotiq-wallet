import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias,} from 'electron-redux';
import getRootReducer from '../reducers';

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @param  {Object} history
 * @return {Object} store
 */
export default function configureStore(initialState, scope = 'main', history) {

  const router = routerMiddleware(history);

  let middleware = [
    thunk,
  ];

  if (scope === 'renderer') {
    middleware = [
      forwardToMain,
      router,
      ...middleware,
    ];
  }

  if (scope === 'main') {
    middleware = [
      triggerAlias,
      ...middleware,
      forwardToRenderer,
    ];
  }

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  const rootReducer = getRootReducer(scope);
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}
