import {push} from 'react-router-redux';

import {CREATE_SCREEN_KEY} from '../constants/navigation';

const navToCreate = () => dispatch => dispatch(push(CREATE_SCREEN_KEY));

export {
  navToCreate,
};