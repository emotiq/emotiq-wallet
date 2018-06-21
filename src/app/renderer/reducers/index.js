import {combineReducers} from 'redux';

import navigation from './navigation';
import wallet from './wallet';
import bootstrap from './bootstrap';

const reducers = () => combineReducers({
  bootstrap,
  wallet,
  navigation,
});

export default reducers;