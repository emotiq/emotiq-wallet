import React, {Component} from 'react';
// todo: extract to store utils
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';

import {Route} from 'react-router';
import appReducers from './reducers';

import Home from './views/Home';
import Menu from './views/Menu';
import Node from "./views/Node";
import Help from "./views/Help";
import RestoreWallet from './views/RestoreWallet';
import Settings from './views/Settings';
import {
  HELP_SCREEN_KEY,
  HOME_SCREEN_KEY,
  NODE_SCREEN_KEY,
  RESTORE_SCREEN_KEY,
  SETTINGS_SCREEN_KEY
} from './constants/navigation';


let initialState = {};

const history = createHistory();

const store = createStore(
  appReducers,
  initialState,
  applyMiddleware(
    thunk,
    routerMiddleware(history),
  ),
);

class Application extends Component {
  render = () =>
    <Provider store={store}>
      {/* ConnectedRouter will use the store from Provider automatically */}
      <div>
        <Menu/>
        <ConnectedRouter history={history}>
          <div>
            {/* todo: routes */}
            <Route exact path={HOME_SCREEN_KEY} component={Home}/>
            <Route exact path={NODE_SCREEN_KEY} component={Node}/>
            <Route exact path={SETTINGS_SCREEN_KEY} component={Settings}/>
            <Route exact path={RESTORE_SCREEN_KEY} component={RestoreWallet}/>
            <Route exact path={HELP_SCREEN_KEY} component={Help}/>
          </div>
        </ConnectedRouter>
      </div>
    </Provider>;
}

export default Application;