import * as sc from 'react-native-spatialconnect';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: null,
  isAuthenticating: false,
  statusText: null,
  isSigningUp: false,
  signUpError: null,
  signUpSuccess: false,
  loginFormValue: {
    email: '',
    password: '',
  },
  signUpFormValue: {
    name: '',
    email: '',
    password: '',
  },
  hasAuthError: false,
};

export default function reducer(state = initialState, action = {}) {
  console.log('auth state is ', state);
  console.log('action is ', action);
  switch (action.type) {
    case sc.Commands.AUTHSERVICE_LOGIN_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED,
        isAuthenticating: false,
        token: action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED ? state.token : null,
      };
    case sc.Commands.AUTHSERVICE_ACCESS_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case 'LOGIN_USER_REQUEST':
      return {
        ...state,
        isAuthenticating: true,
        statusText: null,
      };
    case 'SIGNUP_USER_REQUEST':
      return {
        ...state,
        isSigningUp: true,
        signUpSuccess: false,
      };
    case 'SIGNUP_USER_FAILURE':
      return {
        ...state,
        isSigningUp: false,
        signUpError: action.error,
        signUpSuccess: false,
      };
    case 'SIGNUP_USER_SUCCESS':
      return {
        ...state,
        isSigningUp: false,
        signUpError: null,
        signUpSuccess: true,
      };
    case 'LOGIN_FORM_VALUE':
      return {
        ...state,
        loginFormValue: action.value,
      };
    case 'SIGNUP_FORM_VALUE':
      return {
        ...state,
        signUpFormValue: action.value,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        hasAuthError: true,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export function loginUserRequest() {
  return {
    type: 'LOGIN_USER_REQUEST',
  };
}

export function signUpUserFailure(error) {
  return {
    type: 'SIGNUP_USER_FAILURE',
    error,
  };
}

export function signUpUserSuccess() {
  return {
    type: 'SIGNUP_USER_SUCCESS',
  };
}

export function signUpUserRequest() {
  return {
    type: 'SIGNUP_USER_REQUEST',
  };
}

export function onChangeLoginFormValue(value) {
  return {
    type: 'LOGIN_FORM_VALUE',
    value,
  };
}

export function onChangeSignUpFormValue(value) {
  return {
    type: 'SIGNUP_FORM_VALUE',
    value,
  };
}

export function signUpUser(form) {
  return (dispatch, getState) => {
    const state = getState();
    const backendUri = state.sc.backendUri;
    if (backendUri) {
      dispatch(signUpUserRequest());
      return fetch(`${backendUri}users`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then(response => response.json())
        .then(body => {
          if (body.result.errors) {
            dispatch(signUpUserFailure(body.result.errors[0].message));
          } else if (body.result.error) {
            dispatch(signUpUserFailure(body.result.error));
          } else if (body.error) {
            dispatch(signUpUserFailure(body.error));
          } else if (body.result && body.result.id) {
            dispatch(signUpUserSuccess());
          }
        });
    }
    return dispatch(signUpUserFailure('Sign up unsuccessful.'));
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
    type: 'AUTH_ERROR',
  };
}
