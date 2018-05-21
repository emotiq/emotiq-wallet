import {SET_PASSWORD, WRITE_DOWN_RECOVERY_PHRASE} from "../constants/settings";

const setPassword = () => ({type: SET_PASSWORD});
const writeDownRecoveryPhrase = () => ({type: WRITE_DOWN_RECOVERY_PHRASE});

export {
  setPassword,
  writeDownRecoveryPhrase,
}