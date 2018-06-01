import {handleActions} from 'redux-actions';
import {
  ADD_TRANSACTION,
  DELETE_WALLET,
  RENAME_WALLET,
  RESTORE_WALLET,
  SET_ADDRESSES,
  SET_AMOUNT,
  SET_PASSWORD,
  WRITE_DOWN_RECOVERY_PHRASE
} from '../constants/wallet';

import db from '../db';
import {AccountSchema} from '../db/schema';

function getInitialState() {
  let wallet = db.objects(AccountSchema.name)[0];
  if (wallet === undefined) {
    return {
      activeWallet: null,
    };
  }
  let activeWallet = JSON.parse(JSON.stringify(wallet));
  activeWallet.addresses = Object.values(activeWallet.addresses);
  activeWallet.transactions = Object.values(activeWallet.transactions);
  activeWallet.transactions.forEach(t => {
    t.inputs = Object.values(t.inputs);
    t.outputs = Object.values(t.outputs);
  });
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
  };
};

const writeDownRecoveryPhrase = (state = initialWalletState) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.isRecoveryPhraseWrittenDown = true);
  return {
    ...state,
  };
};

const restoreWallet = (state = initialWalletState, action) => {
  state.activeWallet = action.wallet;
  return {
    ...state,
  };
};

const deleteWallet = (state = initialWalletState) => {
  state.activeWallet = null;
  return {
    ...state,
  };
};

const renameWallet = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.name = action.name);
  return {
    ...state
  };
};

const setAddresses = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.addresses = action.addresses);
  return {
    ...state
  };
};

const setAmount = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.amount = action.amount);
  return {
    ...state,
  };
};

const addTransaction = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.transactions.push(action.transaction));
  return {
    ...state,
  };
};

export default handleActions({
  [SET_PASSWORD]: setPassword,
  [WRITE_DOWN_RECOVERY_PHRASE]: writeDownRecoveryPhrase,
  [RESTORE_WALLET]: restoreWallet,
  [DELETE_WALLET]: deleteWallet,
  [RENAME_WALLET]: renameWallet,
  [SET_ADDRESSES]: setAddresses,
  [SET_AMOUNT]: setAmount,
  [ADD_TRANSACTION]: addTransaction,
}, initialWalletState);