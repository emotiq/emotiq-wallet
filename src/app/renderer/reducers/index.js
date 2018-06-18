import {combineReducers} from 'redux';

import navigation from './navigation';
import wallet from './wallet';
import bootstrap from './bootstrap';
import node from './node';

const reducers = () => combineReducers({
  bootstrap,
  wallet,
  node,
  navigation,
});

export default reducers;