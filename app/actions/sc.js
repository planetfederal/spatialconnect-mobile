'use strict';
import * as sc from 'spatialconnect/native';
import { Actions } from 'react-native-router-flux';

export const connectSC = store => {
  sc.startAllServices();
  sc.forms$().subscribe(store.dispatch);
  sc.stores$().subscribe(store.dispatch);
  sc.loginStatus$().subscribe(action => {
    store.dispatch(action);
    if (action.payload === sc.AuthStatus.SCAUTH_AUTHENTICATED) {
      sc.xAccessToken$().subscribe(store.dispatch);
      Actions.formNav();
    } else {
      Actions.login();
    }
  });
};