const schemaVersion = 4;

const AccountSchema = {
  name: 'Account',
  primaryKey: 'address',
  properties:
    {
      name: 'string',
      address: 'string',
      isPasswordSet: 'bool',
      isRecoveryPhraseWrittenDown: 'bool',
    },
};

const migrations = [
  {
    version: 0,
    migration: (or, nr) => {
    },
  },
  {
    version: 4,
    migration: (or, nr) => {
      nr.objects(AccountSchema.name).forEach(a => {
        a.isPasswordSet = false;
        a.isRecoveryPhraseWrittenDown = false;
      })
    }
  }
];


export {
  schemaVersion,

  AccountSchema,

  migrations,
};