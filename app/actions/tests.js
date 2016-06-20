'use strict';

export const add = (name) => {
  return {
    type: 'ADD_TEST',
    name: name
  };
};

export const passed = (name) => {
  return {
    type: 'TEST_PASSED',
    name: name
  };
};

export const failed = (name, error) => {
  return {
    type: 'TEST_FAILED',
    name: name,
    error: error
  };
};