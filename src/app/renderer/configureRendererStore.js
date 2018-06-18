import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias,} from 'electron-redux';
import getRootReducer from './reducers';

/**
 * @param  {Object} initialState
 * @param  {Object} history
 * @return {Object} store
 */
export default function configureStore(initialState, history) {

  const router = routerMiddleware(history);

  let middleware = [
    forwardToMain,
    router,
    thunk,
  ];

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  const rootReducer = getRootReducer();
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  replayActionRenderer(store);

  return store;
}
