import {
  AccountSchema,
  AddressSchema,
  migrations,
  schemaVersion,
  SettingsSchema,
  TransactionAssetSchema,
  TransactionSchema
} from './schema';

import 'realm';

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