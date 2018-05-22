import {DELETE_WALLET, RESTORE_WALLET, SET_PASSWORD, WRITE_DOWN_RECOVERY_PHRASE} from "../constants/wallet";

import db from '../db';
import {AccountSchema} from '../db/schema';

const setPassword = () => {
  let wallet = db.objects(AccountSchema.name)[0];
  if (wallet !== undefined) {
    db.write(() => {
      wallet.isPasswordSet = true;
    });
  }
  return {type: SET_PASSWORD}
};
const writeDownRecoveryPhrase = () => ({type: WRITE_DOWN_RECOVERY_PHRASE});

const restoreWallet = (wallet) => {
  db.write(() => {
    db.deleteAll();
  });
  wallet.address = '123';
  wallet.isPasswordSet = false;
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
  writeDownRecoveryPhrase,
  restoreWallet,
  deleteWallet,
}