import {handleActions} from 'redux-actions';
import {DELETE_WALLET, RESTORE_WALLET, SET_PASSWORD, WRITE_DOWN_RECOVERY_PHRASE} from "../constants/wallet";

import db from '../db';
import {AccountSchema} from '../db/schema';

function getInitialState() {
  let wallet = db.objects(AccountSchema.name)[0];
  if (wallet === undefined) {
    return {
      activeWallet: null,
    }
  }
  let activeWallet = {
    name: wallet.name,
    password: wallet.password,
    isRecoveryPhraseWrittenDown: wallet.isRecoveryPhraseWrittenDown,
  };
  return {
    activeWallet: activeWallet,
  };
}

const initialWalletState = getInitialState();

const setPassword = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.password = action.password);
  return {
    ...state,
  }
};

const writeDownRecoveryPhrase = (state = initialWalletState) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.isRecoveryPhraseWrittenDown = true);
  return {
    ...state,
  }
};

const restoreWallet = (state = initialWalletState, action) => {
  state.activeWallet = action.wallet;
  return {
    ...state,
  }
};

const deleteWallet = (state = initialWalletState) => {
  state.activeWallet = null;
  return {
    ...state,
  }
};

export default handleActions({
  [SET_PASSWORD]: setPassword,
  [WRITE_DOWN_RECOVERY_PHRASE]: writeDownRecoveryPhrase,
  [RESTORE_WALLET]: restoreWallet,
  [DELETE_WALLET]: deleteWallet,
}, initialWalletState);