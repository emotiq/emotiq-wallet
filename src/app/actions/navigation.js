import {push} from 'react-router-redux';

import {RESTORE_SCREEN_KEY, SETTINGS_SCREEN_KEY} from '../constants/navigation';

const navToRestore = () => dispatch => dispatch(push(RESTORE_SCREEN_KEY));
const navToSettings = () => dispatch => dispatch(push(SETTINGS_SCREEN_KEY));

export {
  navToRestore,
  navToSettings
};