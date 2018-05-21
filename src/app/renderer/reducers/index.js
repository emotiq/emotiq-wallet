import {combineReducers} from 'redux';

import navigation from './navigation';
import settings from './settings';

const reducers = combineReducers({
  navigation,
  settings,
});

export default reducers;