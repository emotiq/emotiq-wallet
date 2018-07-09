import {ACCEPT_TERMS, STATUS, SYNC} from '../../shared/constants/bootstrap';
import * as ws from '../../shared/ws/client';

import db from '../db/index';
import {SettingsSchema} from '../db/schema';
import {SET_STATUS} from '../../shared/constants/node';

const acceptTerms = () => {
  let isTermsAccepted = db.objects(SettingsSchema.name).filtered('name = "isTermsAccepted"')[0];
  if (!!isTermsAccepted) {
    db.write(() => {
      isTermsAccepted = 'true';
    });
  }
  return {type: ACCEPT_TERMS};
};

const syncNode = () => dispatch => {
  ws.connect()
    .then(() => {
      ws.sync()
        .subscribe((data) => {
            dispatch({
              type: SYNC, payload: {
                status: data.synchronized ? STATUS.SYNCED : STATUS.SYNCING,
                blocks: data.epoch,
                currentBlock: data.localEpoch,
              }
            });
            dispatch({
              type: SET_STATUS, payload: {
                numberOfBlocks: data.epoch,
              }
            });
          },
          (error) => {
            console.log(error);
          });
    });
};

export {
  acceptTerms,
  syncNode,
};