'use strict';
import api from '../utils/api';
import * as sc from 'spatialconnect/native';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
  isSigningUp: false,
  signUpError: null,
  signUpSuccess: false,
  loginFormValue: {
    email: '',
    password: ''
  },
  signUpFormValue: {
    name: '',
    email: '',
    password: ''
  },
  hasAuthError: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case sc.Commands.AUTHSERVICE_LOGIN_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED,
        isAuthenticating: false,
        token: action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED ? state.token : null
      };
    case sc.Commands.AUTHSERVICE_ACCESS_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case 'LOGIN_USER_REQUEST':
      return {
        ...state,
        isAuthenticating: true,
        statusText: null
      };
    case 'SIGNUP_USER_REQUEST':
      return {
        ...state,
        isSigningUp: true,
        signUpSuccess: false
      };
    case 'SIGNUP_USER_FAILURE':
      return {
        ...state,
        isSigningUp: false,
        signUpError: action.error,
        signUpSuccess: false
      };
    case 'SIGNUP_USER_SUCCESS':
      return {
        ...state,
        isSigningUp: false,
        signUpError: null,
        signUpSuccess: true
      };
    case 'LOGIN_FORM_VALUE':
      return {
        ...state,
        loginFormValue: action.value
      };
    case 'SIGNUP_FORM_VALUE':
      return {
        ...state,
        signUpFormValue: action.value
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        hasAuthError: true,
      };
    case 'LOGOUT': return initialState;
    default: return state;
  }
}

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


export function login(email, password) {
  return dispatch => {
    dispatch(loginUserRequest());
    sc.authenticate(email, password);
  };
}

export function logout() {
  return dispatch => {
    sc.logout();
    dispatch({ type: 'LOGOUT' });
  };
}

export function authError() {
  return {
    type: 'AUTH_ERROR'
  };
}
