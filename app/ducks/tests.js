
const test = (state, action) => {
  switch (action.type) {
    case 'ADD_TEST':
      return {
        name: action.name,
        passed: false,
        error: { message: 'no result' },
      };
    case 'TEST_PASSED':
      if (state.name !== action.name) {
        return state;
      }
      return {
        ...state,
        passed: true,
      };
    case 'TEST_FAILED':
      if (state.name !== action.name) {
        return state;
      }
      return {
        ...state,
        passed: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default (state = [], action) => {
  switch (action.type) {
    case 'ADD_TEST':
      return [
        ...state,
        test(undefined, action),
      ];
    case 'TEST_PASSED':
      return state.map(t => test(t, action));
    case 'TEST_FAILED':
      return state.map(t => test(t, action));
    default:
      return state;
  }
};

export const add = name => ({
  type: 'ADD_TEST',
  name,
});

export const passed = name => ({
  type: 'TEST_PASSED',
  name,
});

export const failed = (name, error) => ({
  type: 'TEST_FAILED',
  name,
  error,
});
