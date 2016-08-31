'use strict';
import { combineReducers } from 'redux';
import tests from './tests';
import sc from './sc';
import auth from './auth';

const reducer = combineReducers({
  tests,
  sc,
  auth
});

export default reducer;