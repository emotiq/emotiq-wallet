import {ACCEPT_TERMS, INIT_SETTINGS, STATUS, SYNC} from '../../shared/constants/bootstrap';
import {handleActions} from 'redux-actions';
import db from '../db/index';
import {SettingsSchema} from '../db/schema';

function getInitialState() {
  Object.keys(INIT_SETTINGS).forEach(key => {
    let dbValue = db.objects(SettingsSchema.name).filtered('name = "' + key + '"')[0];
    if (dbValue === undefined) {
      db.write(() => {
        db.create(SettingsSchema.name, {
          name: key,
          value: INIT_SETTINGS[key].toString(),
        });
      });
    }
  });
  let isTermsAccepted = db.objects(SettingsSchema.name).filtered('name = "isTermsAccepted"')[0].value === 'true';
  return {
    blocks: 0,
    currentBlock: 0,
    status: isTermsAccepted ? STATUS.STARTING : STATUS.TERMS,
  };
}

const initialState = getInitialState();

const acceptTerms = (state = initialState) => {
  let isTermsAcceptedSetting = db.objects(SettingsSchema.name).filtered('name = "isTermsAccepted"')[0];
  db.write(() => {
    isTermsAcceptedSetting.value = 'true';
  });
  return {
    ...state,
    status: STATUS.STARTING,
  };
};

const setSyncStatus = (state = initialState, action) => {
  let {payload} = action;
  state.status !== STATUS.READY && (state.status !== STATUS.SYNCED || payload.status === STATUS.READY) && (state.status = payload.status);
  return {
    ...state,
    blocks: payload.blocks || state.blocks,
    currentBlock: payload.currentBlock || state.currentBlock,
  };
};

export default handleActions({
  [ACCEPT_TERMS]: acceptTerms,
  [SYNC]: setSyncStatus,
}, initialState);