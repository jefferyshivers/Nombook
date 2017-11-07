import { combineReducers } from 'redux';
import current_user from './current_user';
import search from './search'
import editor from './editor';

const application = combineReducers({
  current_user,
  search,
  editor
});

export default application;