import {handleActions} from 'redux-actions';
import {SET_STATUS, STAKE, UNSTAKE} from '../../shared/constants/node';


const initialState = {
  name: 'TestNet',
  address: '277A27C6C9746DE0C63763A650FCA37C8F1BF9440F017E780C0C4D916FAF3357',
  numberOfPeers: 1000,
  numberOfTransactions: 245,
  numberOfUTXOs: 834,
  transactionRate: 1028,
  myFundsInEscrow: 150,
  fundsInEscrow: 10456,
};

const setStatus = (state = initialState, action) => {
  const {payload} = action;
  return {
    ...state,
    name: payload.name || state.name || '',
    address: payload.address || state.address || '',
    numberOfPeers: payload.numberOfPeers || state.numberOfPeers,
    numberOfBlocks: payload.numberOfBlocks || state.numberOfBlocks,
    numberOfTransactions: payload.numberOfTransactions || state.numberOfTransactions,
    numberOfUTXOs: payload.numberOfUTXOs || state.numberOfUTXOs,
    transactionRate: payload.transactionRate || state.transactionRate,
    myFundsInEscrow: payload.myFundsInEscrow || state.myFundsInEscrow,
    fundsInEscrow: payload.fundsInEscrow || state.fundsInEscrow,
    lastTimestamp: new Date(),
  };
};

const stake = (state = initialState, action) => {
  const {payload} = action;
  return {
    ...state,
    fundsInEscrow: state.fundsInEscrow + payload,
    myFundsInEscrow: state.myFundsInEscrow + payload,
  };
};

const unstake = (state = initialState, action) => {
  const {payload} = action;
  return {
    ...state,
    fundsInEscrow: state.fundsInEscrow - payload,
    myFundsInEscrow: state.myFundsInEscrow - payload,
  };
};

export default handleActions({
  [SET_STATUS]: setStatus,
  [STAKE]: stake,
  [UNSTAKE]: unstake,
}, initialState);