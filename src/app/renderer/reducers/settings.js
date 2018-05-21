import {handleActions} from 'redux-actions';
import {SET_PASSWORD, WRITE_DOWN_RECOVERY_PHRASE} from "../constants/settings";

const initialSettingsState = {
  passwordIsSet: false,
  recoveryPhraseIsWrittenDown: false
};

const setPassword = (state = initialSettingsState) => ({
  ...state,
  passwordIsSet: true
});

const writeDownRecoveryPhrase = (state = initialSettingsState) => ({
  ...state,
  recoveryPhraseIsWrittenDown: true
});

export default handleActions({
  [SET_PASSWORD]: setPassword,
  [WRITE_DOWN_RECOVERY_PHRASE]: writeDownRecoveryPhrase
}, initialSettingsState);