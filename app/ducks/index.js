import { combineReducers } from 'redux';
import tests from './tests';
import sc from './sc';
import auth from './auth';
import map from './map';
import nav from './nav';

const reducer = combineReducers({
  tests,
  sc,
  auth,
  map,
  nav,
});

export default reducer;
