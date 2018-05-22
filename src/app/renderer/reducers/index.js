import {combineReducers} from 'redux';

import navigation from './navigation';
import wallet from './wallet';

const reducers = combineReducers({
  navigation,
  wallet,
});

export default reducers;