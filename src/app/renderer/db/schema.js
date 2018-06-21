const schemaVersion = 8;

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
      transactions: 'Transaction[]',
      addresses: 'Address[]',
    },
};

const TransactionSchema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties:
    {
      id: 'string',
      timestamp: 'int',
      direction: 'string',
      block: 'string',
      fee: 'int',
      type: 'string',
      inputs: 'TransactionAsset[]',
      outputs: 'TransactionAsset[]',
    }
};

const TransactionAssetSchema = {
  name: 'TransactionAsset',
  properties:
    {
      address: 'string',
      amount: 'int',
    }
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
  }
];


export {
  schemaVersion,

  AccountSchema,
  TransactionSchema,
  TransactionAssetSchema,
  AddressSchema,
  SettingsSchema,

  migrations,
};