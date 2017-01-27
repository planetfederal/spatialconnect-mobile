import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../auth';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const state = {
  sc: {
    backendUri: 'test',
  },
};

describe('auth actions', () => {
  it('creates SIGNUP_USER_REQUEST when signing up a new user', () => {
    const store = mockStore(state);
    const response = { result: { id: 1 }, error: null };
    fetch.mockResponseSuccess(response);
    store.dispatch(actions.signUpUser({}))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: 'SIGNUP_USER_REQUEST' },
          { type: 'SIGNUP_USER_SUCCESS' },
        ]);
      });
  });

  it('creates SIGNUP_USER_FAILURE when sign up form is invalid', () => {
    const store = mockStore(state);
    const response = { result: null, error: 'Failed to create new user' };
    fetch.mockResponseSuccess(response);
    store.dispatch(actions.signUpUser({}))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: 'SIGNUP_USER_REQUEST' },
          { type: 'SIGNUP_USER_FAILURE', error: 'Failed to create new user' },
        ]);
      });
  });
});
