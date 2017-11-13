import { combineReducers } from 'redux';
import current_user from './current_user';
import activities from './activities';
import search from './search'
import editor from './editor';

const application = combineReducers({
  current_user,
  activities,
  search,
  editor
});

export default application;