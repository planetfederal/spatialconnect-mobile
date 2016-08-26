/*global jest,describe,it,expect*/
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../auth';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('auth actions', () => {

  it('creates SIGNUP_USER_REQUEST when signing up a new user', () => {
    const store = mockStore();
    return store.dispatch(actions.signUpUser({}))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual([{ type: 'SIGNUP_USER_REQUEST' }, { type: 'SIGNUP_USER_SUCCESS' }]);
      });
  });

  it('creates SIGNUP_USER_FAILURE when sign up form is invalid', () => {
    const store = mockStore();
    return store.dispatch(actions.signUpUser(false))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual([
          { type: 'SIGNUP_USER_REQUEST' },
          { type: 'SIGNUP_USER_FAILURE', error: 'error' }]);
      });
  });

});