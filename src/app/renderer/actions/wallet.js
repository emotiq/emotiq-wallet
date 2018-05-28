import {RESTORE_WALLET, SET_PASSWORD, WRITE_DOWN_RECOVERY_PHRASE} from '../constants/wallet';

import db from '../db';
import {AccountSchema} from '../db/schema';

import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';
import {RECOVERY_PHRASE_LENGTH} from '../constants/config';
import {DICT_EN} from '../constants/dictionary';

const setPassword = (pass, confirmPass) => dispatch => {
  if (pass !== confirmPass) {
    return Promise.reject('Passwords do not match');
  }
  let wallet = db.objects(AccountSchema.name)[0];
  let passwordHash = sha256(pass).toString(hex);
  if (wallet !== undefined) {
    db.write(() => {
      wallet.password = passwordHash;
    });
  }
  dispatch({type: SET_PASSWORD, password: passwordHash});
  return Promise.resolve();
};

const changePassword = (oldPass, newPass, confirmPass) => dispatch => {
  if (newPass !== confirmPass) {
    return Promise.reject('Passwords do not match');
  }
  let wallet = db.objects(AccountSchema.name)[0];
  let oldPasswordHash = sha256(oldPass).toString(hex);
  let newPasswordHash = sha256(newPass).toString(hex);
  if (wallet !== undefined) {
    if (oldPasswordHash !== wallet.password) {
      return Promise.reject('Entered password is incorrect');
    }
    db.write(() => {
      wallet.password = newPasswordHash;
    });
  }
  dispatch({type: SET_PASSWORD, password: newPasswordHash});
  return Promise.resolve();
};

const writeDownRecoveryPhrase = (controlPhrase) => dispatch => {
  let wallet = db.objects(AccountSchema.name)[0];
  if (wallet !== undefined) {
    if (wallet.recoveryPhrase !== controlPhrase) {
      return Promise.reject('You have entered incorrect phrase');
    }
    db.write(() => wallet.isRecoveryPhraseWrittenDown = true);
    dispatch({type: WRITE_DOWN_RECOVERY_PHRASE});
  }
  return Promise.resolve();
};

const restoreWallet = (recoveryPhrase) => dispatch => {
  if (!recoveryPhrase || recoveryPhrase.length < RECOVERY_PHRASE_LENGTH) {
    return Promise.reject('The phrase is incorrect');
  }
  db.write(() => {
    db.deleteAll();
  });

  let restoredWallet = {
    name: 'My wallet',
    address: '123',
    isRecoveryPhraseWrittenDown: false,
    password: '',
    recoveryPhrase: Array.apply(null, {length: RECOVERY_PHRASE_LENGTH}).map(() => DICT_EN[Math.floor(Math.random() * DICT_EN.length)]).join(' '),
  };

  db.write(() => {
    db.create(AccountSchema.name, restoredWallet);
  });

  dispatch({type: RESTORE_WALLET, wallet: restoredWallet});
  return Promise.resolve();
};

export {
  setPassword,
  changePassword,
  writeDownRecoveryPhrase,
  restoreWallet,
};