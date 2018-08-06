import {handleActions} from 'redux-actions';
import {STAKE, UNSTAKE} from '../../shared/constants/node';
import {
  ADD_TRANSACTION,
  DELETE_WALLET,
  RENAME_WALLET,
  RESTORE_WALLET,
  SET_ADDRESSES,
  SET_AMOUNT,
  SET_PASSWORD,
  SET_TRANSACTIONS,
  SET_WALLET,
  WRITE_DOWN_RECOVERY_PHRASE
} from '../../shared/constants/wallet';

import db from '../db/index';
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
  return {
    activeWallet: activeWallet,
  };
}

const initialWalletState = getInitialState();

const setPassword = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.password = action.payload);
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

const setWallet = (state = initialWalletState, action) => {
  state.activeWallet = action.payload;
  return {
    ...state,
  };
};

const restoreWallet = (state = initialWalletState, action) => {
  state.activeWallet = action.payload;
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
  activeWallet && (activeWallet.name = action.payload);
  return {
    ...state
  };
};

const setAddresses = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.addresses = action.payload);
  return {
    ...state
  };
};

const setAmount = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.amount = action.payload);
  return {
    ...state,
  };
};

const stake = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.amount -= action.payload);
  return {
    ...state,
  };
};

const unstake = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.amount += action.payload);
  return {
    ...state,
  };
};

const setTransactions = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.transactions = action.payload.transactions);
  return {
    ...state,
  };
};

const addTransaction = (state = initialWalletState, action) => {
  let {activeWallet} = state;
  activeWallet && (activeWallet.transactions.push(action.payload));
  return {
    ...state,
  };
};

export default handleActions({
  [SET_PASSWORD]: setPassword,
  [WRITE_DOWN_RECOVERY_PHRASE]: writeDownRecoveryPhrase,
  [SET_WALLET]: setWallet,
  [RESTORE_WALLET]: restoreWallet,
  [DELETE_WALLET]: deleteWallet,
  [RENAME_WALLET]: renameWallet,
  [SET_ADDRESSES]: setAddresses,
  [SET_AMOUNT]: setAmount,
  [ADD_TRANSACTION]: addTransaction,
  [SET_TRANSACTIONS]: setTransactions,
  [STAKE]: stake,
  [UNSTAKE]: unstake,
}, initialWalletState);