import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import configureStore from '../shared/store/configureStore';
import createHistory from 'history/createMemoryHistory';
import Bootstrap from './views/Bootstrap';

let initialState = {};

const history = createHistory();

const store = configureStore(initialState, 'renderer', history);

class Application extends Component {
  render = () =>
    <Provider store={store}>
      {/* ConnectedRouter will use the store from Provider automatically */}
      <Bootstrap history={history}/>
    </Provider>;
}

ReactDOM.render(<Application/>, document.getElementById('root'));
registerServiceWorker();
