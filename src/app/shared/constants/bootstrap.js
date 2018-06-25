const ACCEPT_TERMS = 'ACCEPT_TERMS';
const SYNC = 'SYNC';
const STATUS = Object.freeze({
    'TERMS': 1,
    'STARTING': 2,
    'SYNCING': 3,
    'SYNCED': 4,
    'READY': 5,
  }
);
const INIT_SETTINGS = {
  isTermsAccepted: false,
};

export {
  ACCEPT_TERMS,
  SYNC,
  STATUS,
  INIT_SETTINGS,
};