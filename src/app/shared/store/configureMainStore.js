import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {forwardToMain, forwardToRenderer, replayActionMain, replayActionRenderer, triggerAlias,} from 'electron-redux';

/**
 * @param  {Object} initialState
 * @return {Object} store
 */
export default function configureMainStore(initialState) {

  let middleware = [
    triggerAlias,
    thunk,
    forwardToRenderer,
  ];

  const enhanced = [
    applyMiddleware(...middleware),
  ];

  const enhancer = compose(...enhanced);
  const store = createStore(() => combineReducers({}), initialState, enhancer);

  replayActionMain(store);

  return store;
}
