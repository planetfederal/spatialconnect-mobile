'use strict';

const test = (state, action) => {
  switch (action.type) {
    case 'ADD_TEST':
      return {
        name: action.name,
        passed: false,
        error: { message: 'no result' }
      };
    case 'TEST_PASSED':
      if (state.name !== action.name) {
        return state;
      }
      return Object.assign({}, state, {
        passed: true
      });
    case 'TEST_FAILED':
      if (state.name !== action.name) {
        return state;
      }
      return Object.assign({}, state, {
        passed: false,
        error: action.error
      });
    default:
      return state;
  }
};

const tests = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TEST':
      return [
        ...state,
        test(undefined, action)
      ];
    case 'TEST_PASSED':
      return state.map(t =>
        test(t, action)
      );
    case 'TEST_FAILED':
      return state.map(t =>
        test(t, action)
      );
    default:
      return state;
  }
};

export default tests;