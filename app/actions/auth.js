'use strict';
import api from '../utils/api';

export function loginUserRequest() {
  return {
    type: 'LOGIN_USER_REQUEST'
  };
}

export function signUpUserFailure(error) {
  return {
    type: 'SIGNUP_USER_FAILURE',
    error: error
  };
}

export function signUpUserSuccess() {
  return {
    type: 'SIGNUP_USER_SUCCESS'
  };
}

export function signUpUserRequest() {
  return {
    type: 'SIGNUP_USER_REQUEST'
  };
}

export function onChangeLoginFormValue(value) {
  return {
    type: 'LOGIN_FORM_VALUE',
    value: value
  };
}

export function onChangeSignUpFormValue(value) {
  return {
    type: 'SIGNUP_FORM_VALUE',
    value: value
  };
}

export function signUpUser(form) {
  return dispatch => {
    dispatch(signUpUserRequest());
    return api.signUp(form)
      .then(body => {
        console.log('body', body);
        if (body.success) {
          dispatch(signUpUserSuccess());
        } else {
          if (body.error.errors) {
            dispatch(signUpUserFailure(body.error.errors[0].message));
          } else {
            dispatch(signUpUserFailure(body.error));
          }
        }
      });
  };
}