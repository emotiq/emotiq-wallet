import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// todo: extract to store utils
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';

import {Route} from 'react-router';
import appReducers from './reducers';

import StartScreen from './views/StartScreen';
import CreateWallet from './views/CreateWallet';
import TestScreen from './views/TestScreen';
import {CREATE_SCREEN_KEY, START_SCREEN_KEY} from './constants/navigation';


let initialState = {};

const history = createHistory();

// TODO: electron-redux
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
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={TestScreen}/>
          <Route path={START_SCREEN_KEY} component={StartScreen}/>
          <Route path={CREATE_SCREEN_KEY} component={CreateWallet}/>
        </div>
      </ConnectedRouter>
    </Provider>;
}

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Application/>, document.getElementById('root'));
registerServiceWorker();
