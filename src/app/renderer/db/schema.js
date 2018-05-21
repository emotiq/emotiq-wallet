const schemaVersion = 3;

const AccountSchema = {
  name: 'Account',
  primaryKey: 'address',
  properties:
    {
      name: 'string',
      address: 'string',
    },
};

const migrations = [
  {
    version: 0,
    migration: (or, nr) => {
    },
  },
];


export {
  schemaVersion,

  AccountSchema,

  migrations,
};