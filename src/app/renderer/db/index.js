import {
  AccountSchema,
  AddressSchema,
  migrations,
  schemaVersion,
  SettingsSchema,
  TransactionAssetSchema,
  TransactionSchema
} from './schema';

import os from 'os';
import fs from 'fs';

const dir = os.homedir + '/.realm';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const Realm = window.require('realm');

Realm.defaultPath = dir + '/emotiq-wallet.realm';

const schema = {
  schema: [AccountSchema, AddressSchema, SettingsSchema, TransactionSchema, TransactionAssetSchema],
  schemaVersion,
  migration: function (oldRealm, newRealm) {
    migrations.forEach((ma) => {
      if (oldRealm.schemaVersion < ma.version) {
        ma.migration.call(this, oldRealm, newRealm);
      }
    });
  },
};

const db = new Realm(schema);
export {
  schema,
  db as default,
};