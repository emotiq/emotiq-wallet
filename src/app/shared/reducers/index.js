import {combineReducers} from 'redux';

import navigation from './navigation';
import wallet from './wallet';
import bootstrap from './bootstrap';

const reducers = (scope = 'main') => {
  let reducers = {
    bootstrap,
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers,
      wallet,
      navigation,
    };
  }
  return combineReducers({...reducers});
};

export default reducers;