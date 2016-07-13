'use strict';
import * as sc from 'spatialconnect/native';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case sc.Commands.AUTHSERVICE_LOGIN_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED,
        isAuthenticating: false
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
    default: return state;
  }
}


