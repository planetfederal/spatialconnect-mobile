'use strict';
import { combineReducers } from 'redux';
import tests from './tests';
import sc from './sc';
import auth from './auth';
import routes from './routes';

const reducer = combineReducers({
  tests,
  sc,
  auth,
  routes
});

export default reducer;