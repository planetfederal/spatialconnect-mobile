'use strict';
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
  }
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
    default: return state;
  }
}


