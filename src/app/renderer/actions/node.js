import {STAKE, UNSTAKE} from '../../shared/constants/node';

const stake = (amount) => dispatch => {
  dispatch({type: STAKE, payload: amount});
};

const unstake = (amount) => dispatch => {
  dispatch({type: UNSTAKE, payload: amount});
};

export {
  stake,
  unstake,
};