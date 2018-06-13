import {ACCEPT_TERMS, STATUS, SYNC} from '../constants/bootstrap';
import * as ws from '../ws/client';

import db from '../../renderer/db/index';
import {SettingsSchema} from '../../renderer/db/schema';

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