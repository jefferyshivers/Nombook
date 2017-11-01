import { combineReducers } from 'redux';
import current_user from './current_user';
import editor from './editor';

const application = combineReducers({
  current_user,
  // navigator,
  editor
});

export default application;