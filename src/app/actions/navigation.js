import {push} from 'react-router-redux';

import {
  HELP_SCREEN_KEY,
  HOME_SCREEN_KEY,
  NODE_SCREEN_KEY,
  RESTORE_SCREEN_KEY,
  SETTINGS_SCREEN_KEY
} from '../constants/navigation';

const navToRestore = () => dispatch => dispatch(push(RESTORE_SCREEN_KEY));
const navToHome = () => dispatch => dispatch(push(HOME_SCREEN_KEY));
const navToNode = () => dispatch => dispatch(push(NODE_SCREEN_KEY));
const navToSettings = () => dispatch => dispatch(push(SETTINGS_SCREEN_KEY));
const navToHelp = () => dispatch => dispatch(push(HELP_SCREEN_KEY));

export {
  navToRestore,
  navToSettings,
  navToHelp,
  navToHome,
  navToNode
};