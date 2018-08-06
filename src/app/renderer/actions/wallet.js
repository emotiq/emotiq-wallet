import hex from 'crypto-js/enc-hex';

import sha256 from 'crypto-js/sha256';
import {RECOVERY_PHRASE_LENGTH} from '../../shared/constants/config';
import {RENAME_WALLET, SET_PASSWORD, SET_WALLET, WRITE_DOWN_RECOVERY_PHRASE} from '../../shared/constants/wallet';
import * as ws from '../../shared/ws/client';

import db from '../db/index';
import {AccountSchema} from '../db/schema';

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
  dispatch({type: SET_PASSWORD, payload: passwordHash});
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
  dispatch({type: SET_PASSWORD, payload: newPasswordHash});
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

const getWallet = () => dispatch => {
  let wallet = {};
  return _getWallet()
    .then(wal => wallet = wal)
    .then(_getTransactions)
    .then(transactions => wallet.transactions = transactions)
    .then(ws.getRecoveryPhrase)
    .then(data => wallet.recoveryPhrase = data.keyphrase.join(' '))
    .then(() => {
      wallet.addresses = [{address: wallet.address, used: false}];//websocket is not ready yet
      db.write(() => {
        db.create(AccountSchema.name, wallet, true);
      });
      dispatch({
        type: SET_WALLET, payload: wallet,
      });
    });
};

const _getWallet = () =>
  ws.getWallet()
    .then(data => {
      let dbWallet = db.objects(AccountSchema.name).filtered('address = "' + data.address + '"')[0];
      let wallet = {
        name: !!dbWallet && !!dbWallet.name ? dbWallet.name : 'My Wallet',//websocket is not ready yet
        address: data.address,
        amount: data.amount,
        isRecoveryPhraseWrittenDown: !!dbWallet && !!dbWallet.isRecoveryPhraseWrittenDown,
      };
      !!dbWallet && !!dbWallet.password && (wallet.password = dbWallet.password);
      return wallet;
    });

const _getTransactions = () =>
  ws.getTransactions()
    .then(data =>
      data.map(t => ({
        ...t,
        direction: t.type === 'spend' ? 'OUT' : 'IN',
        block: '0000000000000xf58a0xf523119cda01d2a5561c689968ec5a219096158a',//websocket is not ready yet
      })));

const restoreWallet = (recoveryPhrase) => dispatch => {
  if (!recoveryPhrase || recoveryPhrase.length < RECOVERY_PHRASE_LENGTH) {
    return Promise.reject('The phrase is incorrect');
  }
  db.write(() => {
    db.delete(db.objects(AccountSchema.name));
  });
  let res, rej;
  let promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  dispatch(getWallet())
    .then((data) => res(data))
    .catch((e) => rej(e));
  return promise;
};

const renameWallet = (name) => dispatch => {
  let wallet = db.objects(AccountSchema.name)[0];
  if (wallet !== undefined) {
    db.write(() => wallet.name = name);
  }
  dispatch({type: RENAME_WALLET, payload: name});
  return Promise.resolve();
};

const sendEMTQ = (address, amount, wal) => dispatch =>
  ws.submitTransaction({
    transaction: {address: address, amount: amount},
    name: wal.name,
    address: wal.address
  })
    .then(() => dispatch(getWallet()));

export {
  setPassword,
  changePassword,
  writeDownRecoveryPhrase,
  getWallet,
  restoreWallet,
  renameWallet,
  sendEMTQ,
};