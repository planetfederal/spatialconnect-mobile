'use strict';
import { combineReducers } from 'redux';
import tests from './tests';
import forms from './forms';
import stores from './stores';

const reducer = combineReducers({
  tests,
  forms,
  stores
});

export default reducer;