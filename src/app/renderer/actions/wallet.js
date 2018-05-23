import {
  DELETE_WALLET,
  RESTORE_WALLET,
  SET_PASSWORD,
  WRITE_DOWN_RECOVERY_PHRASE
} from "../constants/wallet";

import db from '../db';
import {AccountSchema} from '../db/schema';

import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';

const setPassword = (pass) => {
  let wallet = db.objects(AccountSchema.name)[0];
  let passwordHash = sha256(pass).toString(hex);
  if (wallet !== undefined) {
    db.write(() => {
      wallet.password = passwordHash;
    });
  }
  return {type: SET_PASSWORD, password: passwordHash}
};

const changePassword = (oldPass, newPass) => dispatch => {
  let wallet = db.objects(AccountSchema.name)[0];
  let oldPasswordHash = sha256(oldPass).toString(hex);
  let newPasswordHash = sha256(newPass).toString(hex);
  if (wallet !== undefined) {
    if (oldPasswordHash !== wallet.password) {
      let message = 'Entered password is incorrect';
      // alert(message);
      return Promise.reject(message);
    }
    db.write(() => {
      wallet.password = newPasswordHash;
    });
  }
  dispatch({type: SET_PASSWORD, password: newPasswordHash});
  return Promise.resolve();
};

const writeDownRecoveryPhrase = () => ({type: WRITE_DOWN_RECOVERY_PHRASE});

const restoreWallet = (wallet) => {
  db.write(() => {
    db.deleteAll();
  });
  wallet.address = '123';
  wallet.password = '';
  wallet.isRecoveryPhraseWrittenDown = false;
  db.write(() => {
    db.create(AccountSchema.name, wallet);
  });
  return {type: RESTORE_WALLET, wallet: wallet}
};

const deleteWallet = () => {
  db.write(() => {
    db.deleteAll();
  });
  return {type: DELETE_WALLET}
};

export {
  setPassword,
  changePassword,
  writeDownRecoveryPhrase,
  restoreWallet,
  deleteWallet,
}