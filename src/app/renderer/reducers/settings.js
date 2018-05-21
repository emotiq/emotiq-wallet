import {handleActions} from 'redux-actions';
import {SET_PASSWORD, WRITE_DOWN_RECOVERY_PHRASE} from "../constants/settings";

const initialSettingsState = {
  passwordSet: false,
  writeDownRecoveryPhrase: false
};

const setPassword = (state = initialSettingsState) => ({
  ...state,
  passwordSet: true
});

const writeDownRecoveryPhrase = (state = initialSettingsState) => ({
  ...state,
  writeDownRecoveryPhrase: true
});

export default handleActions({
  [SET_PASSWORD]: setPassword,
  [WRITE_DOWN_RECOVERY_PHRASE]: writeDownRecoveryPhrase
}, initialSettingsState);