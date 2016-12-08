import { combineReducers } from 'redux';
import tests from './tests';
import sc from './sc';
import auth from './auth';
import routes from './routes';
import map from './map';

const reducer = combineReducers({
  tests,
  sc,
  auth,
  routes,
  map,
});

export default reducer;
