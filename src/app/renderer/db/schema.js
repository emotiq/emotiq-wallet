const schemaVersion = 9;

const AccountSchema = {
  name: 'Account',
  primaryKey: 'address',
  properties:
    {
      name: 'string',
      address: 'string',
      amount: 'int',
      password: 'string?',
      isRecoveryPhraseWrittenDown: 'bool',
      recoveryPhrase: 'string?',
      addresses: 'Address[]',
    },
};

const AddressSchema = {
  name: 'Address',
  primaryKey: 'address',
  properties:
    {
      address: 'string',
      used: 'bool'
    }
};

const SettingsSchema = {
  name: 'Settings',
  properties:
    {
      name: 'string',
      value: 'string',
    }
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
        a.isRecoveryPhraseWrittenDown = false;
      });
    }
  },
  {
    version: 5,
    migration: (or, nr) => {
      nr.objects(AccountSchema.name).forEach(a => {
        a.password = '';
      });
    }
  },
  {
    version: 6,
    migration: (or, nr) => {
      nr.objects(AccountSchema.name).forEach(a => {
        a.recoveryPhrase = '';
      });
    }
  },
  {
    version: 7,
    migration: (or, nr) => {
      nr.objects(AccountSchema.name).forEach(a => {
        a.amount = 200;
        a.transactions = [];
        a.addresses = [];
      });
    }
  },
  {
    version: 8,
    migration: (or, nr) => {
    }
  }
];


export {
  schemaVersion,

  AccountSchema,
  AddressSchema,
  SettingsSchema,

  migrations,
};