import {AccountSchema, schemaVersion, migrations} from './schema';

const Realm = window.require('realm');

const schema = {
  schema: [AccountSchema],
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