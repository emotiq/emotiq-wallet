import {
  ADD_TRANSACTION,
  RENAME_WALLET,
  RESTORE_WALLET,
  SET_AMOUNT,
  SET_PASSWORD,
  SET_WALLET,
  WRITE_DOWN_RECOVERY_PHRASE
} from '../constants/wallet';
import {RECOVERY_PHRASE_LENGTH} from '../constants/config';
import {DICT_EN} from '../constants/dictionary';

import db from '../db/index';
import {AccountSchema} from '../db/schema';
import * as ws from '../ws/client';

import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';

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
  let wallet = [];
  ws.getWallet()
    .subscribe((data) => {
      let dbWallet = db.objects(AccountSchema.name).filtered('address = "' + data.address + '"')[0];
      wallet = {
        name: !!dbWallet && !!dbWallet.name ? dbWallet.name : 'My Wallet',//websocket is not ready yet
        address: data.address,
        amount: data.amount,
        isRecoveryPhraseWrittenDown: !!dbWallet && !!dbWallet.isRecoveryPhraseWrittenDown,
      };
      !!dbWallet && !!dbWallet.password && (wallet.password = dbWallet.password);
      ws.getTransactions()
        .subscribe((data) => {
          wallet.transactions = data;
          wallet.transactions.forEach(t => {
            t.direction = 'OUT';//websocket is not ready yet
            t.block = '0000000000000xf58a0xf523119cda01d2a5561c689968ec5a219096158a';//websocket is not ready yet
          });
        });
      wallet.addresses = getAddresses();//websocket is not ready yet
      ws.getRecoveryPhrase()
        .subscribe(data => {
          wallet.recoveryPhrase = data.keyphrase.join(' ');
        });
      let checkTimer = setInterval(() => {
        if (!!wallet.transactions && !!wallet.addresses && !!wallet.recoveryPhrase) {
          db.write(() => {
            db.create(AccountSchema.name, wallet, true);
          });
          dispatch({
            type: SET_WALLET, payload: wallet,
          });
          clearInterval(checkTimer);
        }
      }, 100);
    });
  return Promise.resolve();
};

const restoreWallet = (recoveryPhrase) => dispatch => {
  if (!recoveryPhrase || recoveryPhrase.length < RECOVERY_PHRASE_LENGTH) {
    return Promise.reject('The phrase is incorrect');
  }
  db.write(() => {
    db.delete(db.objects(AccountSchema.name));
  });

  let restoredWallet = {
    name: 'My wallet',
    address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
    isRecoveryPhraseWrittenDown: false,
    amount: 200,
    transactions: [],
    recoveryPhrase: Array.apply(null, {length: RECOVERY_PHRASE_LENGTH}).map(() => DICT_EN[Math.floor(Math.random() * DICT_EN.length)]).join(' '),
  };

  db.write(() => {
    db.create(AccountSchema.name, restoredWallet);
  });
  dispatch({type: RESTORE_WALLET, payload: restoredWallet});
  return Promise.resolve();
};

const renameWallet = (name) => dispatch => {
  let wallet = db.objects(AccountSchema.name)[0];
  if (wallet !== undefined) {
    db.write(() => wallet.name = name);
  }
  dispatch({type: RENAME_WALLET, payload: name});
  return Promise.resolve();
};

const getAddresses = () => {
  return [
    {address: '0x7292c5521bb29e5a976bbaab40e3fae3f87810430x7292c5521bb29e5a976bbaab40e3fae3f8781043', used: true},
    {address: '0xfe829a79d43c4b1b6e0b85979f60825a568c02af0xfe829a79d43c4b1b6e0b85979f60825a568c02af', used: true},
    {address: '0x04347c3933259c967e4597a869577c9d1e53eded0x04347c3933259c967e4597a869577c9d1e53eded', used: true},
    {address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be', used: true},
    {address: '0x99d188d71f432ca4e769fd4a13f5446b091ba7450x99d188d71f432ca4e769fd4a13f5446b091ba745', used: true},
    {address: '0xf523119cda01d2a5561c689968ec5a219096158a0xf523119cda01d2a5561c689968ec5a219096158a', used: false}];
};

const sendEMTQ = (address, amount) => dispatch => {
  let wallet = db.objects(AccountSchema.name)[0];
  let symbols = '1234567890qwertyuiopasdfghjklzxcvbnm'.split('');
  if (wallet !== undefined) {
    let transaction = {
      id: Array.apply(null, {length: 130}).map(() => symbols[Math.floor(Math.random() * symbols.length)]).join(''),
      timestamp: Date.now(),
      direction: 'OUT',
      amount: +amount,
      block: '0000000000000xf58a0xf523119cda01d2a5561c689968ec5a219096158a',
      fee: Math.ceil(amount * 0.01),
      type: 'EMTQ Spend transaction',
      inputs: [{address: wallet.address, amount: amount - 1}, {address: wallet.address + '123', amount: 1}],
      outputs: [{address: address, amount: amount}],
    };

    db.write(() => {
      wallet.amount -= amount + Math.ceil(amount * 0.01);
      wallet.transactions.push(transaction);
    });

    dispatch({type: SET_AMOUNT, payload: wallet.amount});
    dispatch({type: ADD_TRANSACTION, payload: transaction});
  }
  return Promise.resolve();
};

export {
  setPassword,
  changePassword,
  writeDownRecoveryPhrase,
  getWallet,
  renameWallet,
  sendEMTQ,
};