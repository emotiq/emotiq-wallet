import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias,} from 'electron-redux';
import getRootReducer from '../reducers';

/**
 * @param  {Object} initialState
 * @param  {Object} history
 * @return {Object} store
 */
export default function configureStore(initialState, history) {

  const router = routerMiddleware(history);

  let middleware = [
    thunk,
  ];

  middleware = [
    forwardToMain,
    router,
    ...middleware,
  ];

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  const rootReducer = getRootReducer();
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  replayActionRenderer(store);

  return store;
}
