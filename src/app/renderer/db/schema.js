const schemaVersion = 5;

const AccountSchema = {
  name: 'Account',
  primaryKey: 'address',
  properties:
    {
      name: 'string',
      address: 'string',
      password: 'string',
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
  },
  {
    version: 5,
    migration: (or, nr) => {
      nr.objects(AccountSchema.name).forEach(a => {
        a.password = '';
      })
    }
  }
];


export {
  schemaVersion,

  AccountSchema,

  migrations,
};